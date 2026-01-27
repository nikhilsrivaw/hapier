import  prisma  from '../../lib/prisma';                                                               
  export class RecruitmentService {                                                                     
  
      // ==================== JOBS ====================
      async getJobs(orgId: string, filters?: { status?: string; departmentId?: string }) {
          return prisma.job.findMany({
              where: {
                  organizationId: orgId,
                  ...(filters?.status && { status: filters.status as any }),
                  ...(filters?.departmentId && { departmentId: filters.departmentId })
              },
              include: {
                  department: true,
                  _count: { select: { applications: true } }
              },
              orderBy: { createdAt: 'desc' }
          });
      }

      async getJobById(id: string, orgId: string) {
          return prisma.job.findFirst({
              where: { id, organizationId: orgId },
              include: {
                  department: true,
                  applications: {
                      include: {
                          candidate: true
                      }
                  },
                  interviews: {
                      include: {
                          candidate: true,
                          interviewer: true
                      }
                  }
              }
          });
      }

      async createJob(data: any, orgId: string) {
          return prisma.job.create({
              data: {
                  ...data,
                  organizationId: orgId
              },
              include: { department: true }
          });
      }

      async updateJob(id: string, data: any, orgId: string) {
          return prisma.job.update({
              where: { id },
              data: {
                  ...data,
                  ...(data.status === 'CLOSED' && { closedAt: new Date() })
              },
              include: { department: true }
          });
      }

      async deleteJob(id: string, orgId: string) {
          return prisma.job.delete({
              where: { id }
          });
      }

      // ==================== CANDIDATES ====================
      async getCandidates(orgId: string, filters?: { jobId?: string; source?: string }) {
          const where: any = { organizationId: orgId };

          if (filters?.source) {
              where.source = filters.source;
          }

          if (filters?.jobId) {
              where.applications = { some: { jobId: filters.jobId } };
          }

          return prisma.candidate.findMany({
              where,
              include: {
                  applications: {
                      include: { job: true }
                  },
                  _count: { select: { interviews: true, notes: true } }
              },
              orderBy: { createdAt: 'desc' }
          });
      }

      async getCandidateById(id: string, orgId: string) {
          return prisma.candidate.findFirst({
              where: { id, organizationId: orgId },
              include: {
                  applications: {
                      include: { job: true }
                  },
                  interviews: {
                      include: { job: true, interviewer: true },
                      orderBy: { scheduledAt: 'desc' }
                  },
                  notes: {
                      include: { author: true },
                      orderBy: { createdAt: 'desc' }
                  }
              }
          });
      }

      async createCandidate(data: any, orgId: string) {
          const { jobId, ...candidateData } = data;

          const candidate = await prisma.candidate.create({
              data: {
                  ...candidateData,
                  organizationId: orgId
              }
          });

          // If jobId provided, create application
          if (jobId) {
              await prisma.application.create({
                  data: {
                      candidateId: candidate.id,
                      jobId,
                      organizationId: orgId
                  }
              });
          }

          return this.getCandidateById(candidate.id, orgId);
      }

      async updateCandidate(id: string, data: any, orgId: string) {
          return prisma.candidate.update({
              where: { id },
              data,
              include: {
                  applications: { include: { job: true } }
              }
          });
      }

      async deleteCandidate(id: string, orgId: string) {
          return prisma.candidate.delete({
              where: { id }
          });
      }

      // ==================== APPLICATIONS ====================
      async getApplications(orgId: string, filters?: { jobId?: string; stage?: string }) {
          return prisma.application.findMany({
              where: {
                  organizationId: orgId,
                  ...(filters?.jobId && { jobId: filters.jobId }),
                  ...(filters?.stage && { stage: filters.stage as any })
              },
              include: {
                  candidate: true,
                  job: true
              },
              orderBy: { appliedAt: 'desc' }
          });
      }

      async createApplication(data: { candidateId: string; jobId: string }, orgId: string) {
          return prisma.application.create({
              data: {
                  ...data,
                  organizationId: orgId
              },
              include: {
                  candidate: true,
                  job: true
              }
          });
      }

      async updateApplicationStage(
          id: string,
          stage: string,
          orgId: string,
          rejectionReason?: string
      ) {
          const updateData: any = { stage };

          if (stage === 'HIRED') {
              updateData.hiredAt = new Date();
          } else if (stage === 'REJECTED') {
              updateData.rejectedAt = new Date();
              updateData.rejectionReason = rejectionReason;
          }

          return prisma.application.update({
              where: { id },
              data: updateData,
              include: {
                  candidate: true,
                  job: true
              }
          });
      }

      // ==================== INTERVIEWS ====================
      async getInterviews(orgId: string, filters?: {
          candidateId?: string;
          jobId?: string;
          status?: string
      }) {
          return prisma.interview.findMany({
              where: {
                  organizationId: orgId,
                  ...(filters?.candidateId && { candidateId: filters.candidateId }),
                  ...(filters?.jobId && { jobId: filters.jobId }),
                  ...(filters?.status && { status: filters.status as any })
              },
              include: {
                  candidate: true,
                  job: true,
                  interviewer: true
              },
              orderBy: { scheduledAt: 'asc' }
          });
      }

      async createInterview(data: any, orgId: string) {
          return prisma.interview.create({
              data: {
                  ...data,
                  organizationId: orgId
              },
              include: {
                  candidate: true,
                  job: true,
                  interviewer: true
              }
          });
      }

      async updateInterview(id: string, data: any, orgId: string) {
          return prisma.interview.update({
              where: { id },
              data,
              include: {
                  candidate: true,
                  job: true,
                  interviewer: true
              }
          });
      }

      async addInterviewFeedback(id: string, feedback: string, rating: number, orgId: string) {
          return prisma.interview.update({
              where: { id },
              data: {
                  feedback,
                  rating,
                  status: 'COMPLETED'
              },
              include: {
                  candidate: true,
                  job: true,
                  interviewer: true
              }
          });
      }

      // ==================== CANDIDATE NOTES ====================
      async addCandidateNote(candidateId: string, content: string, userId: string, orgId: string) {     
          // Get employee id from user id
          const employee = await prisma.employee.findFirst({
              where: { userId, organizationId: orgId }
          });

          if (!employee) {
              throw new Error('Employee not found');
          }

          return prisma.candidateNote.create({
              data: {
                  candidateId,
                  content,
                  authorId: employee.id,
                  organizationId: orgId
              },
              include: { author: true }
          });
      }

      // ==================== ANALYTICS ====================
      async getAnalytics(orgId: string) {
          const [
              totalJobs,
              openJobs,
              totalCandidates,
              totalApplications,
              applicationsByStage,
              recentHires,
              sourceStats,
              avgTimeToHire
          ] = await Promise.all([
              prisma.job.count({ where: { organizationId: orgId } }),
              prisma.job.count({ where: { organizationId: orgId, status: 'OPEN' } }),
              prisma.candidate.count({ where: { organizationId: orgId } }),
              prisma.application.count({ where: { organizationId: orgId } }),
              prisma.application.groupBy({
                  by: ['stage'],
                  where: { organizationId: orgId },
                  _count: true
              }),
              prisma.application.count({
                  where: {
                      organizationId: orgId,
                      stage: 'HIRED',
                      hiredAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                  }
              }),
              prisma.candidate.groupBy({
                  by: ['source'],
                  where: { organizationId: orgId },
                  _count: true
              }),
              prisma.application.findMany({
                  where: {
                      organizationId: orgId,
                      stage: 'HIRED',
                      hiredAt: { not: null }
                  },
                  select: { appliedAt: true, hiredAt: true }
              })
          ]);

          // Calculate average time to hire
          let avgDays = 0;
          if (avgTimeToHire.length > 0) {
              const totalDays = avgTimeToHire.reduce((sum, app) => {
                  if (app.hiredAt) {
                      const days = Math.floor(
                          (app.hiredAt.getTime() - app.appliedAt.getTime()) / (1000 * 60 * 60 * 24)     
                      );
                      return sum + days;
                  }
                  return sum;
              }, 0);
              avgDays = Math.round(totalDays / avgTimeToHire.length);
          }

          // Convert groupBy results to objects
          const stageStats = applicationsByStage.reduce((acc: any, item) => {
              acc[item.stage] = item._count;
              return acc;
          }, {});

          const sources = sourceStats.reduce((acc: any, item) => {
              acc[item.source] = item._count;
              return acc;
          }, {});

          return {
              overview: {
                  totalJobs,
                  openJobs,
                  totalCandidates,
                  totalApplications,
                  recentHires,
                  avgTimeToHire: avgDays
              },
              pipeline: stageStats,
              sources
          };
      }
  }
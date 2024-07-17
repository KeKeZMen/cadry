import { Injectable } from "@nestjs/common";
import { CreateJobRequestDto } from "./dto/create-job-request.dto";
import { UpdateJobRequestDto } from "./dto/update-job-request.dto";
import { DatabaseService } from "@libs/database";

@Injectable()
export class JobRequestService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createJobRequestDto: CreateJobRequestDto) {
    return this.databaseService.jobRequest.create({
      data: {
        ...createJobRequestDto,
      },
    });
  }

  findOne(id: string) {
    return this.databaseService.jobRequest.findFirst({
      where: {
        id,
      },
    });
  }

  findAll() {
    return this.databaseService.jobRequest.findMany();
  }

  findManyByOrganizationId(organizationId: string) {
    return this.databaseService.jobRequest.findMany({
      where: {
        workOrganizationId: organizationId,
      },
    });
  }

  update(id: string, updateJobRequestDto: UpdateJobRequestDto) {
    return this.databaseService.jobRequest.update({
      where: {
        id,
      },
      data: {
        ...updateJobRequestDto,
      },
    });
  }

  remove(id: string) {
    return this.databaseService.jobRequest.delete({
      where: {
        id,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { AmountRange, Project } from 'src/shared/entities';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class AmountRangeRepository {
  constructor(private readonly entityManager: EntityManager) {}

  getAssignedAmountRanges(userId: number): Promise<AmountRange[]> {
    return this.getAmountRanges((qb) =>
      qb
        .leftJoinAndSelect('project.projectAssignments', 'project_assignment')
        .where('project_assignment.userId = :userId', { userId: userId })
        .andWhere('project_assignment.active = :active', { active: true }),
    );
  }

  getManagedAmountRanges(userId: number): Promise<AmountRange[]> {
    return this.getAmountRanges((qb) =>
      qb
        .leftJoinAndSelect('project.office', 'office')
        .leftJoinAndSelect('office.region', 'region')
        .leftJoinAndSelect('region.userRegions', 'user_region')
        .where('user_region.userId = :userId', { userId: userId }),
    );
  }

  getAmountRanges(
    queryBuilderFn?: (
      qb: SelectQueryBuilder<AmountRange>,
    ) => SelectQueryBuilder<AmountRange>,
  ): Promise<AmountRange[]> {
    let qb = this.entityManager.connection
      .createQueryBuilder(AmountRange, 'amount_range')
      .leftJoinAndSelect('amount_range.currency', 'currency')
      .leftJoin(
        Project,
        'project',
        '(amount_range.minAmount is null or project.viableAmount >= amount_range.minAmount) and (amount_range.maxAmount is null or project.viableAmount <= amount_range.maxAmount)',
      )
      .select([
        'amount_range.id',
        'amount_range.minAmount',
        'amount_range.maxAmount',
        'currency.isoCode',
      ]);

    if (queryBuilderFn) {
      qb = queryBuilderFn(qb);
    }
    return qb.getMany();
  }
}

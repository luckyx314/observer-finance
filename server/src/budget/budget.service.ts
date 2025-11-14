import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, userId: number): Promise<Budget> {
    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      userId,
    });
    return this.budgetRepository.save(budget);
  }

  async findAllByUser(userId: number): Promise<Budget[]> {
    return this.budgetRepository.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto, userId: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({ where: { id, userId } });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    Object.assign(budget, updateBudgetDto);
    return this.budgetRepository.save(budget);
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.budgetRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Budget not found');
    }
  }
}

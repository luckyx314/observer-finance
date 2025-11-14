import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto, userId: number): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      ...createWalletDto,
      currency: createWalletDto.currency?.toUpperCase() ?? 'PHP',
      userId,
    });
    return this.walletRepository.save(wallet);
  }

  async findAllByUser(userId: number): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { userId } });
  }

  async update(id: number, updateWalletDto: UpdateWalletDto, userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { id, userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    Object.assign(wallet, {
      ...updateWalletDto,
      currency: updateWalletDto.currency
        ? updateWalletDto.currency.toUpperCase()
        : wallet.currency,
    });
    return this.walletRepository.save(wallet);
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.walletRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Wallet not found');
    }
  }
}

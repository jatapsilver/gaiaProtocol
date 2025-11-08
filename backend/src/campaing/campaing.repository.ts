import { InjectRepository } from '@nestjs/typeorm';
import { Campaing } from 'src/entities/campaing.entity';
import { Repository } from 'typeorm';
import { CreateCampaingDto } from './Dtos/createCampaing.dto';
import { User } from 'src/entities/users.entity';
import { ApproveCampaingDto } from './Dtos/approveCampaing.dto';
import { CampaingStatus } from 'src/enums/campaing.enum';
import { Contract, JsonRpcProvider, Wallet, parseUnits } from 'ethers';

// ABI mínimo de CampaignManager para crear campaña
const CAMPAIGN_MANAGER_ABI = [
  'function createCampaign(string uuid_, string name_, string description_, uint256 startAt_, uint256 endAt_, address creator_, string[] participantNames, address[] participantWallets, uint256 rewardAmount_) external returns (uint256)',
];

export class CampaingRepository {
  constructor(
    @InjectRepository(Campaing)
    private readonly campaingRepository: Repository<Campaing>,
  ) {}

  async getAllCampaingsRepository() {
    return await this.campaingRepository.find();
  }

  async createCampaingRepository(
    createCampaingDto: CreateCampaingDto,
    userExisting: User,
  ) {
    const newCampaing = this.campaingRepository.create({
      ...createCampaingDto,
      creator: userExisting,
    });
    return await this.campaingRepository.save(newCampaing);
  }

  async getCampaingByName(name: string) {
    return this.campaingRepository.findOne({ where: { name } });
  }

  async getCampaingById(campaingId: string) {
    return this.campaingRepository.findOne({
      where: { id: campaingId },
      relations: ['participants'],
    });
  }

  async approveCampaingRepository(
    campaing: Campaing,
    approveCampaingDto: ApproveCampaingDto,
  ) {
    campaing.campaignStatus = CampaingStatus.ACTIVE;
    campaing.token = approveCampaingDto.token;
    return await this.campaingRepository.save(campaing);
  }

  async joinCampaingRepository(campaing: Campaing, user: User) {
    const willReachCapacity =
      campaing.currentParticipants + 1 === campaing.totalParticipants;
    campaing.currentParticipants += 1;
    if (!campaing.participants) {
      campaing.participants = [];
    }
    campaing.participants.push(user);
    if (willReachCapacity) {
      campaing.campaignStatus = CampaingStatus.INPROGRESS;
    }
    const saved = await this.campaingRepository.save(campaing);

    // Si alcanzó la capacidad, crea la campaña on-chain en CampaignManager
    if (willReachCapacity) {
      this.createOnchainCampaign(saved).catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('Error creando campaña on-chain:', msg);
      });
    }
    return saved;
  }

  private async createOnchainCampaign(c: Campaing) {
    const rpcUrl = process.env.RPC_URL ?? '';
    const privateKey = process.env.PRIVATE_KEY ?? '';
    const managerAddress = process.env.CAMPAIGN_MANAGER_ADDRESS ?? '';

    if (!rpcUrl || !privateKey || !managerAddress) {
      throw new Error(
        'Faltan variables de entorno: RPC_URL, PRIVATE_KEY o CAMPAIGN_MANAGER_ADDRESS',
      );
    }
    if (!c.creator?.wallet) {
      throw new Error('El creador de la campaña no tiene wallet definida');
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const provider: JsonRpcProvider = new JsonRpcProvider(rpcUrl);
    const signer: Wallet = new Wallet(privateKey, provider);
    const contract: Contract = new Contract(
      managerAddress,
      CAMPAIGN_MANAGER_ABI,
      signer,
    );

    // Usamos el UUID de la campaña de la base de datos
    const uuid = c.id; // UUID generado por PostgreSQL
    const name = c.name;
    const description = c.description || '';
    const startAtSec: bigint = BigInt(
      Math.floor(new Date(c.startDate).getTime() / 1000),
    );
    const endAtSec: bigint = BigInt(
      Math.floor(new Date(c.endDate).getTime() / 1000),
    );
    const creatorAddress = c.creator.wallet as `0x${string}`;
    const participantNames = (c.participants || []).map((p) => p.name);
    const participantWallets = (c.participants || []).map(
      (p) => p.wallet as `0x${string}`,
    );
    // Interpretamos c.token como cantidad de GAIA con 18 decimales
    const rewardAmountWei: bigint = parseUnits(String(c.token || 0), 18);

    console.log('🚀 Creando campaña on-chain:', {
      uuid,
      name,
      manager: managerAddress,
      participants: participantWallets.length,
    });

    const tx: { wait: (conf?: number) => Promise<{ hash: string }> } = await (
      contract as any
    ).createCampaign(
      uuid, // ✅ NUEVO: UUID como primer parámetro
      name,
      description,
      startAtSec,
      endAtSec,
      creatorAddress,
      participantNames,
      participantWallets,
      rewardAmountWei,
    );
    const receipt = await tx.wait();

    console.log('✅ Campaña creada on-chain. TX Hash:', receipt.hash);

    // Guardar el hash de la transacción en la base de datos
    c.onchainTxHash = receipt.hash;
    await this.campaingRepository.save(c);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
  }
}

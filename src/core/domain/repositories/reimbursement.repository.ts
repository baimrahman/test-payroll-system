import { Reimbursement } from "@domain/entities";
import { IBaseRepository } from "./base.repository";

export abstract class IReimbursementRepository extends IBaseRepository<Reimbursement> {
}
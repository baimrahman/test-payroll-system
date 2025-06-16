import { DBTransaction } from "@infrastructure/database";

export type SelectRequest<Model> = {
  [K in keyof Model]?: boolean;
};

export type DataRequest<Model> = {
  [K in keyof Model]?: Model[K] extends string | number | boolean | Date
    ? Model[K]
    : Model[K] extends string | number | undefined
      ? Model[K] | null
      : never;
};

export type WhereRequest<Model> = {
  [K in keyof Model]?: Model[K] extends string | number
    ? Model[K] | { in?: Model[K][] }
    : Model[K] extends Date
      ? {
          gte?: Model[K] | string;
          lte?: Model[K] | string;
          equals?: Model[K] | string;
          not?: Model[K] | string;
        }
      : Model[K] extends boolean
        ? Model[K]
        : Model[K] extends string | undefined
          ? Model[K] | null
          : never;
};

export type WhereUniqueRequest<Model> = {
  id: Model extends { id: infer ID } ? ID : never;
} & Partial<Omit<Model, 'id'>>;

export type OrderByRequest<Model> =
  | { [K in keyof Model]?: 'asc' | 'desc' }
  | Array<{ [K in keyof Model]?: 'asc' | 'desc' }>;

export type FindRequest<Model> = {
  select?: SelectRequest<Model>;
  where: WhereRequest<Model>;
  orderBy?: OrderByRequest<Model>;
  take?: number;
  skip?: number;
};

export type FindAllRequest<Model> = {
  select?: SelectRequest<Model>;
  where?: WhereRequest<Model>;
  orderBy?: OrderByRequest<Model>;
  take?: number;
  skip?: number;
};

export type CreateRequest<Model> = {
  data: Partial<
    Pick<Model, Extract<keyof Model, 'id' | 'createdAt' | 'updatedAt'>>
  > &
    Omit<Model, 'id' | 'createdAt' | 'updatedAt'>;
};

export type CreateManyRequest<Model> = {
  data: Partial<
    Pick<Model, Extract<keyof Model, 'id' | 'createdAt' | 'updatedAt'>>
  >[] &
    Omit<Model, 'id' | 'createdAt' | 'updatedAt'>[];
};

export type UpdateRequest<Model> = {
  where: WhereUniqueRequest<Model>;
  data: DataRequest<Model>;
};

export type UpdateManyRequest<Model> = {
  where: WhereRequest<Model>;
  data: Partial<Model>;
};

export type DeleteRequest<Model> = {
  where: WhereUniqueRequest<Model>;
};

export type DeleteManyRequest<Model> = {
  where: WhereRequest<Model>;
};

export type CountRequest<Model> = {
  where: WhereRequest<Model>;
};

export type SelectedFields<
  Model,
  Select extends SelectRequest<Model> | undefined,
> = Select extends undefined
  ? Model
  : {
      [K in keyof Model as K extends keyof Select
        ? Select[K] extends true
          ? K
          : never
        : never]: Model[K];
    };

export abstract class IBaseRepository<Model> {
  abstract find<Req extends FindRequest<Model>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Model, Req['select']> | null>;
  abstract findAll<Req extends FindAllRequest<Model>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Model, Req['select']>[]>;
  abstract create(
    req: CreateRequest<Model>,
    tx?: DBTransaction,
  ): Promise<Model>;
  abstract update(req: UpdateRequest<Model>, tx?: DBTransaction): Promise<void>;
  abstract delete(req: DeleteRequest<Model>, tx?: DBTransaction): Promise<void>;
}
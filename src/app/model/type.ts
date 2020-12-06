export enum Gender {
  ALL,
  MALE ,
  FEMALE,
}

export enum ResponseResult {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class UserSimpleSet {
  public auth: string;
  public page_srl: number;
}

export class ResponseSet {
  public category: ResponseResult;
  public message: string;
  public description: string;
}

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
  public id: number;
  public token: string;
}

export class ResponseSet {
  public category: ResponseResult;
  public message: string;
  public description: string;
}

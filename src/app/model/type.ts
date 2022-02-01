export enum Gender {
  ALL,
  MALE ,
  FEMALE,
}

export enum ChatSpaceCategory {
  ROOM,
  CHAT,
  LIVE,
}

export enum ResponseResult {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class UserSimpleSet {
  public id: number;
  public token: string;
}

export class User {
  public id: number;
  public email_host: string;
  public email_name: string;
  public name: string;
  public last_name: string;
  public relation?: Relation;
}

export class Relation {
  public id: number;
  public category: RelationCategory;
  public status: RelationStatus;
  public target?: User;
  public user_id: number;
  public target_id: number;
}

export class Chat {
  public id?: number;
  public content: string;
  public user?: User;
}

export class Group {
  public id: number;
  public name: string;
  public user_id: number;
  public target_id: number;
  public target?: User;
}

export class Room {
  public id: number;
  public name: string;
  public description: string;
  public user?: User;
  public group: Group;
  public online_count: number;
  public limit: number;
  public status: number;

}

export enum RelationCategory {
  FRIEND,
  BLOCKED,
}

export enum RelationStatus {
  NORMAL,
  REMOVED,
  PENDING,
  REQUEST_RECEIVED,
}

export class ResponseSet {
  public category: ResponseResult;
  public message: string;
  public description: string;
}

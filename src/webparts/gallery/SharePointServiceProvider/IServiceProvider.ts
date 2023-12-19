export interface IServiceProvider {
  getImages(list: any): Promise<any[]>;
}

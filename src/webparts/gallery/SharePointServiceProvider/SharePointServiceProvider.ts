import { IServiceProvider } from "./IServiceProvider";
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp/presets/all";
import { ImageHelper, IImageHelperRequest } from "@microsoft/sp-image-helper";

export default class SharepointServiceProvider implements IServiceProvider {
  constructor(_context: BaseWebPartContext) {}

  public async getImages(lists: any): Promise<any[]> {
    let _items: any[];
    let getitems = await sp.web.lists
      .getById(lists)
      .items.expand("File")
      .select("File/ServerRelativeUrl, File/Name, ID, Created, Modified")
      .getAll();

    _items = [];
    for (let i = 0; i < getitems.length; i++) {
      let item = getitems[i];
      const resizedImage = item.File
        ? ImageHelper.convertToImageUrl(<IImageHelperRequest>{
            sourceUrl: item.File.ServerRelativeUrl,
            width: 200,
          })
        : "";
      var lst: any = {
        Name: item.File ? item.File.Name : "",
        ImageUrl: resizedImage,
        ServerRelativeUrl: item.File ? item.File.ServerRelativeUrl : "",
        Created: item.Created,
        Modified: item.Modified,
        Id: item.ID,
      };

      _items.push(lst);
      // console.log(_items);
    }
    return _items;
  }
}

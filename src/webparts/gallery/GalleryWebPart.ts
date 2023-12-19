import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  PropertyPaneDropdown,
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import Gallery from "./components/Gallery";
import { IGalleryProps } from "./components/IGalleryProps";
import {
  PropertyFieldListPicker,
  PropertyFieldListPickerOrderBy,
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
import SharepointServiceProvider from "./SharePointServiceProvider/SharePointServiceProvider";
import { sp } from "@pnp/sp/presets/all";
import { IServiceProvider } from "./SharePointServiceProvider/IServiceProvider";

export interface IGalleryWebPartProps {
  lists: string | string[];
  sortBy: string;
  title: string;
}

export default class GalleryWebPart extends BaseClientSideWebPart<IGalleryWebPartProps> {
  private _serviceProvider: IServiceProvider;
  protected onInit(): Promise<void> {
    this._serviceProvider = new SharepointServiceProvider(this.context);
    sp.setup({
      spfxContext: this.context as any,
    });
    return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<IGalleryProps> = React.createElement(
      Gallery,
      {
        lists: this.properties.lists,
        provider: this._serviceProvider,
        sortBy: this.properties.sortBy,
        title: this.properties.title,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: "Basic Configuration",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Title",
                  placeholder: "Image Gallery",
                }),
                PropertyFieldListPicker("lists", {
                  label: "Select a list",
                  selectedList: this.properties.lists,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  deferredValidationTime: 0,
                  key: "listPickerFieldId",
                }),
                PropertyPaneDropdown("sortBy", {
                  label: "Sort",
                  options: [
                    {
                      key: "ModifiedAsc",
                      text: "Modified (Newer to Older)",
                    },
                    {
                      key: "ModifiedDsc",
                      text: "Modified (Older to Newer)",
                    },
                    {
                      key: "CreatedAsc",
                      text: "Created (Newer to Older)",
                    },
                    {
                      key: "CreatedDsc",
                      text: "Created (Older to Newer)",
                    },
                    {
                      key: "NameAsc",
                      text: "Name (Ascending)",
                    },
                    {
                      key: "NameDsc",
                      text: "Name (Descending)",
                    },
                  ],
                  selectedKey: "NameAsc",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

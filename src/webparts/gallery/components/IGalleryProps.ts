import { IServiceProvider } from "../SharePointServiceProvider/IServiceProvider";

export interface IGalleryProps {
  lists: string | string[];
  provider: IServiceProvider;
  sortBy: string;
  title: string;
}

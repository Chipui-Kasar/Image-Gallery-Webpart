import * as React from "react";
import styles from "./Gallery.module.scss";
import { IGalleryProps } from "./IGalleryProps";

const Gallery = (props: IGalleryProps) => {
  const [lists, setlists] = React.useState([]);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    props.lists
      ? props.provider.getImages(props.lists).then((res: any) => {
          res.sort((a: any, b: any) => {
            if (props.sortBy === undefined || props.sortBy === "NameAsc") {
              return a.Name.localeCompare(b.Name);
            } else if (props.sortBy === "NameDsc") {
              return b.Name.localeCompare(a.Name);
            } else if (props.sortBy === "CreatedAsc") {
              return (
                new Date(a.Created).getTime() - new Date(b.Created).getTime()
              );
            } else if (props.sortBy === "CreatedDsc") {
              return (
                new Date(b.Created).getTime() - new Date(a.Created).getTime()
              );
            } else if (props.sortBy === "ModifiedAsc") {
              return (
                new Date(b.Modified).getTime() - new Date(a.Modified).getTime()
              );
            } else if (props.sortBy === "ModifiedDsc") {
              return (
                new Date(a.Modified).getTime() - new Date(b.Modified).getTime()
              );
            } else {
              // Handle other cases or provide a default sorting logic
              return 0;
            }
          });
          res.length === 0 ? setError("No items found") : setError("");
          setlists(res);
        })
      : setError("Please select a list from property pane");
  }, [props]);
  const navigateToImage = (url: string) => {
    window.open(url, "_blank");
  };
  return (
    <section className={`${styles.gallery_container}`}>
      <h2>{props.title}</h2>
      <div className={`${lists.length > 0 ? styles.gallery : ""}`}>
        {lists.length > 0 ? (
          lists.map((item: any) => {
            return (
              <img
                src={item.ImageUrl}
                alt={item.Name}
                onClick={() => navigateToImage(item.ServerRelativeUrl)}
              />
            );
          })
        ) : (
          <div className={styles.error}>{error}</div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

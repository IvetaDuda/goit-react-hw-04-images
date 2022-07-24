import { useContext } from 'react';
import Context from 'context';

import css from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ tags, webformatURL, largeImageURL }) => {
  const { ImgClick } = useContext(Context);
  return (
    <li className={css.ImageGalleryItem} id="card">
      <img
        className={css.ImageGalleryItemImage}
        onClick={() => {
          ImgClick(largeImageURL, tags);
        }}
        src={webformatURL}
        alt={tags}
      />
    </li>
  );
};

export default ImageGalleryItem;

import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Scroll from 'react-scroll';

import fetchImages from '../../services/FetchImages';
import useToggle from '../../hoogs/useToggle';
import Context from '../../context';

import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Button from '../Button/';
import Loader from '../Loader';
import Modal from '../Modal';
import ErrorMessage from '../ErrorMessage';
import Title from '../Title';

const statuss = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVE: 'resolve',
  REJECTED: 'rejected',
};

const App = () => {
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(statuss.IDLE);
  const [totalImages, setTotalImages] = useState(0);
  const [largeImageUrl, setLargeImageUrl] = useState('');
  const [tag, setTeg] = useState('');

  useEffect(() => {
    if (!image) {
      return;
    }
    setStatus(statuss.PENDING);
    fetchImages(image, page)
      .then(data => {
        const images = data.hits.map(
          ({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          })
        );

        if (images.length === 0) {
          setStatus(statuss.REJECTED);
        } else {
          setImages(prevState => [...prevState, ...images]);
          if (page === 1) {
            setTotalImages(data.totalHits);
          }
          setStatus(statuss.RESOLVE);
        }
      })
      .catch(() => setStatus(statuss.REJECTED));
  }, [image, page]);

  const hendelFormSubmit = image => {
    setImage(image);
    setPage(1);
    setImages([]);
  };

  const handleImgOpenClick = (largeImageUrl, tag) => {
    setLargeImageUrl(largeImageUrl);
    setTeg(tag);
    toggle();
  };

  const LoadMoreButtonClick = () => {
    setPage(page + 1);
    scrollToMoreBtn();
  };

  const scrollToMoreBtn = () => {
    Scroll.animateScroll.scrollMore(600);
  };

  const countPages = Math.ceil(totalImages / 12);
  const { isOpen, toggle } = useToggle();

  return (
    <Context.Provider value={{ ImgClick: handleImgOpenClick }}>
      <Searchbar onFormSubmit={hendelFormSubmit} />
      {status === statuss.IDLE && <Title />}
      {status === statuss.PENDING && <Loader />}
      {status === statuss.REJECTED && <ErrorMessage images={image} />}
      {status === statuss.RESOLVE && <ImageGallery images={images} />}
      {status === statuss.RESOLVE && page < countPages && (
        <Button onLoadMoreButtonClick={LoadMoreButtonClick} />
      )}
      {isOpen && (
        <Modal onClose={toggle}>
          <img src={largeImageUrl} alt={tag} width="800" />
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </Context.Provider>
  );
};

export default App;

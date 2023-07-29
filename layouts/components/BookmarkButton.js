import { useEffect, useState } from 'react';

   
const Post = ({ post }) => {
    const { summary_length, blog_folder } = config.settings;
    const { meta_author } = config.metadata;
};

const BookmarkButton = () => {
  const [bookmarkSupported, setBookmarkSupported] = useState(false);

  useEffect(() => {
    setBookmarkSupported('showModal' in navigator && 'requestWakeLock' in navigator);
  }, []);
    
        const handleBookmarkClick = () => {
            if (bookmarkSupported) {
                const title = post.frontmatter.title;
                const url = post.frontmatter.href;

                // Save bookmark in specific folder using the 'showModal' API
                navigator
                    .showModal('bookmark', { url, title })
                    .then(() => {
                        console.log('Bookmark saved successfully!');
                    })
                    .catch((error) => {
                        console.error('Failed to save bookmark:', error);
                    });
            } else {
                alert('Your browser is unsupported for this feature, please use your browser\'s bookmarking feature.');
            }
        };
    

  return (
    <button onClick={handleBookmarkClick} disabled={!bookmarkSupported}>
      Bookmark this page
    </button>
  );
};

export default BookmarkButton;
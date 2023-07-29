import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Pagination from "@layouts/components/Pagination";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import { sortByDate } from "@lib/utils/sortFunctions";
import Post from "@partials/Post";

import CustomForm from "@layouts/components/NewsLetterForm";
import MailchimpSubscribe from "react-mailchimp-subscribe";

const { blog_folder, summary_length } = config.settings;
const { newsletter } = config.widgets;

// blog pagination
const BlogPagination = ({ postIndex, posts, currentPage, pagination }) => {
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const orderedPosts = sortByDate(posts);
  const currentPosts = orderedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const { frontmatter } = postIndex;
  const { title } = frontmatter;
  const totalPages = Math.ceil(posts.length / pagination);

  return (
    <Base title={title}>
      <section className="section">
        <div className="container">
          {markdownify(title, "h1", "h2 mb-8 text-center")}
          <div className="row mb-16">
            {currentPosts.map((post, i) => (
              <div className="mt-16 lg:col-6" key={post.slug}>
                <Post post={post} />
              </div>
            ))}
          </div>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </section>
      <div className="mt-6 items-center rounded border border-darkmode-border p-6 text-center dark:border-darkmode-border">
                    <h4 className="section-title">{newsletter.title}</h4>
                    <p className="mt-10 text-xs">{newsletter.content}</p>
                    <MailchimpSubscribe
                      url={newsletter.mailchimp_url}
                      render={({ subscribe, status, message }) => (
                        <CustomForm
                          onValidated={(formData) => subscribe(formData)}
                          status={status}
                          message={message}
                        />
                      )}
                    />
        </div>
    </Base>
  );
};

export default BlogPagination;

// get blog pagination slug
export const getStaticPaths = () => {
  const getAllSlug = getSinglePage(`content/${blog_folder}`);
  const allSlug = getAllSlug.map((item) => item.slug);
  const { pagination } = config.settings;
  const totalPages = Math.ceil(allSlug.length / pagination);
  let paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

// get blog pagination content
export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { pagination } = config.settings;
  const posts = getSinglePage(`content/${blog_folder}`);
  const postIndex = await getListPage(`content/${blog_folder}/_index.md`);

  return {
    props: {
      pagination: pagination,
      posts: posts,
      currentPage: currentPage,
      postIndex: postIndex,
    },
  };
};

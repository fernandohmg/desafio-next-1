import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function onCarregarMaisClick(url: string) {
    const response = await fetch(url).then(res => res.json());

    setNextPage(response.next_page);
    setPosts([...posts, ...response.results]);
  }

  return (
    <main className={commonStyles.contentContainer}>
      <div className={styles.posts}>
        {posts.map(post => {
          return (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <div>
                    <FiCalendar />
                    <time>{post.first_publication_date}</time>
                  </div>
                  <div>
                    <FiUser />
                    {post.data.author}
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
      {nextPage && (
        <button
          className={styles.loadMoreButton}
          onClick={() => onCarregarMaisClick(nextPage)}
        >
          Carregar mais posts
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    { fetch: ['posts.title', 'posts.subtitle', 'posts.author'], pageSize: 1 }
  );

  const posts = postsResponse.results.map<Post>(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: { results: posts, next_page: postsResponse.next_page },
    },
  };
};

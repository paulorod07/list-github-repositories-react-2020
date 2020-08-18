import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';

import styles from './Repository.module.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;

  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;

  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      setRepository(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });
  }, [params.repository]);

  return (
    <>
      <header className={styles.header}>
        <img src={logo} alt="Github Explorer" />
        <Link to="/">
          <MdChevronLeft size={16} />
          Voltar
        </Link>
      </header>
      {repository ? (
        <section className={styles.repoInfo}>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </section>
      ) : (
        <div className={styles.loader}>
          <ClipLoader size={150} color="#123abc" />
        </div>
      )}
      <div className={styles.issues}>
        {issues.map(item => (
          <a key={item.id} href={item.html_url}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.user.login}</p>
            </div>

            <MdChevronRight size={20} />
          </a>
        ))}
      </div>
    </>
  );
};

export default Repository;

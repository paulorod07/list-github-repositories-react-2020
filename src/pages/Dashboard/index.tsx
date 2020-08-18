import React, { useState, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { MdChevronRight } from 'react-icons/md';
import styles from './Dashboard.module.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
  id: number;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const localRepos = localStorage.getItem('github repositories');

    if (localRepos) {
      return JSON.parse(localRepos);
    }
    return [];
  });
  const [inputError, setInputError] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    localStorage.setItem('github repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório.');
      setError(true);
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      setRepositories([...repositories, response.data]);
      setNewRepo('');
      setInputError('');
      setError(false);
    } catch (err) {
      setInputError('Repositório não encontrado.');
      setError(true);
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <h1 className={styles.title}>Explore repositórios no Github.</h1>
      <form onSubmit={handleAddRepository} className={styles.form}>
        {error ? (
          <input
            className={styles.hasError}
            value={newRepo}
            onChange={event => setNewRepo(event.target.value)}
            placeholder="Digite o nome do repositório"
          />
        ) : (
          <input
            className={styles.input}
            value={newRepo}
            onChange={event => setNewRepo(event.target.value)}
            placeholder="Digite o nome do repositório"
          />
        )}
        <button type="submit">Pesquisar</button>
      </form>
      {inputError && <span>{inputError}</span>}
      <div className={styles.repositories}>
        {repositories.map(item => (
          <Link key={item.id} to={`/repositories/${item.full_name}`}>
            <img src={item.owner.avatar_url} alt={item.owner.login} />
            <div>
              <strong>{item.full_name}</strong>
              <p>{item.description}</p>
            </div>

            <MdChevronRight size={20} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Dashboard;

import git from 'simple-git';
import logger from './logger';

export type GitFileInfo = {
  latestAuthorName: string;
  latestAuthorEmail: string;
  latestDate: string;
};

export async function getGitFileInfo(
  repoFolder: string,
  filePath: string,
): Promise<GitFileInfo | undefined> {
  const gitRepo = git(repoFolder);

  const logOptions = {
    file: filePath,
    n: 1,
    format: {
      date: '%aI',
      authorName: '%an',
      authorEmail: '%ae',
    },
  };

  try {
    const { latest } = await gitRepo.log(logOptions);

    if (!latest) {
      return;
    }

    return {
      latestAuthorName: latest.authorName,
      latestAuthorEmail: latest.authorEmail,
      latestDate: latest.date,
    };
  } catch (e) {
    logger.debug(e, `${filePath} not found in repo`);
    return;
  }
}

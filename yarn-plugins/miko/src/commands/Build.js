import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project, structUtils } from '@yarnpkg/core';
import { Worker } from 'jest-worker';

export default class Build extends Command {
  @Command.Path('build')
  execute = async () => {
    const { cwd, plugins } = this.context;
    const { run } = this.cli;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project: { workspaces }, locator } = await Project.find(configuration, projectCwd);

    await configuration.triggerHook(
      ({ build }) => build,
      Worker,
      workspaces.filter(workspace =>
        structUtils.stringifyIdent(workspace.locator) !== structUtils.stringifyIdent(locator)
      ),
    );
  };
}

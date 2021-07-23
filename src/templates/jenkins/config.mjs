/*
 * @Author: Whzcorcd
 * @Date: 2021-07-21 10:30:30
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-23 11:23:08
 * @Description: file content
 */
export default `<?xml version='1.1' encoding='UTF-8'?>
<project>
  <actions />
  <description><%= description %></description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <jenkins.model.BuildDiscarderProperty>
      <strategy class="hudson.tasks.LogRotator">
        <daysToKeep>7</daysToKeep>
        <numToKeep>3</numToKeep>
        <artifactDaysToKeep>-1</artifactDaysToKeep>
        <artifactNumToKeep>-1</artifactNumToKeep>
      </strategy>
    </jenkins.model.BuildDiscarderProperty>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions><% -%>
        <% if (parameters) { %><% -%>
        <% parameters.forEach(function(parameter){ %>
        <hudson.model.ChoiceParameterDefinition>
          <name><%= parameter.key %></name>
          <description><%= parameter.description %></description>
          <choices class="java.util.Arrays$ArrayList">
            <a class="string-array"><% -%>
              <% parameter.value.forEach(function(item){ %>
              <string><%= item -%></string><% -%>
              <% }) %>
            </a>
          </choices>
        </hudson.model.ChoiceParameterDefinition><% -%>
        <% }) %><% -%>
        <% } %>
        <net.uaznia.lukanus.hudson.plugins.gitparameter.GitParameterDefinition plugin="git-parameter@0.9.13">
          <name>BRANCH</name>
          <description>构建分支名/标签名</description>
          <uuid>86169477-0076-4fad-9832-1942ddf8c0f5</uuid>
          <type>PT_BRANCH_TAG</type>
          <branch></branch>
          <tagFilter>*</tagFilter>
          <branchFilter>.*</branchFilter>
          <sortMode>NONE</sortMode>
          <defaultValue>*/master</defaultValue>
          <selectedValue>NONE</selectedValue>
          <quickFilterEnabled>false</quickFilterEnabled>
          <listSize>5</listSize>
        </net.uaznia.lukanus.hudson.plugins.gitparameter.GitParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <scm class="hudson.plugins.git.GitSCM" plugin="git@4.6.0">
    <configVersion>2</configVersion>
    <userRemoteConfigs>
      <hudson.plugins.git.UserRemoteConfig>
        <url><%= source.url %></url>
        <credentialsId><%= source.credentialsId %></credentialsId>
      </hudson.plugins.git.UserRemoteConfig>
    </userRemoteConfigs>
    <branches>
      <hudson.plugins.git.BranchSpec>
        <name>$BRANCH</name>
      </hudson.plugins.git.BranchSpec>
    </branches>
    <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
    <submoduleCfg class="empty-list" />
    <extensions />
  </scm>
  <canRoam>true</canRoam>
  <disabled>false</disabled>
  <blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
  <blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
  <triggers />
  <concurrentBuild>false</concurrentBuild>
  <builders>
    <hudson.tasks.Shell>
      <command><%= build.prevCommand %></command>
      <configuredLocalRules />
    </hudson.tasks.Shell>
    <jenkins.plugins.publish__over__ssh.BapSshBuilderPlugin plugin="publish-over-ssh@1.22">
      <delegate>
        <consolePrefix>SSH: </consolePrefix>
        <delegate plugin="publish-over@0.22">
          <publishers><% -%>
            <% if (build.publishers) { %><% -%>
            <% build.publishers.forEach(function(publisher){ %>
            <jenkins.plugins.publish__over__ssh.BapSshPublisher plugin="publish-over-ssh@1.22">
              <configName><%= publisher.server %></configName>
              <verbose>true</verbose>
              <transfers>
                <jenkins.plugins.publish__over__ssh.BapSshTransfer>
                  <remoteDirectory><%= publisher.remoteDirectory %></remoteDirectory>
                  <sourceFiles><%= publisher.sourceFiles %></sourceFiles>
                  <excludes></excludes>
                  <removePrefix><%= publisher.removePrefix %></removePrefix>
                  <remoteDirectorySDF>false</remoteDirectorySDF>
                  <flatten>false</flatten>
                  <cleanRemote>false</cleanRemote>
                  <noDefaultExcludes>false</noDefaultExcludes>
                  <makeEmptyDirs>false</makeEmptyDirs>
                  <patternSeparator>[, ]+</patternSeparator>
                  <execCommand><%= publisher.execCommand %></execCommand>
                  <execTimeout>120000</execTimeout>
                  <usePty>false</usePty>
                  <useAgentForwarding>false</useAgentForwarding>
                  <useSftpForExec>false</useSftpForExec>
                </jenkins.plugins.publish__over__ssh.BapSshTransfer>
              </transfers>
              <useWorkspaceInPromotion>false</useWorkspaceInPromotion>
              <usePromotionTimestamp>false</usePromotionTimestamp>
              <label class="jenkins.plugins.publish_over_ssh.BapSshPublisherLabel">
                <label><%= publisher.label %></label>
              </label>
            </jenkins.plugins.publish__over__ssh.BapSshPublisher><% -%>
            <% }) %><% -%>
            <% } %>
          </publishers>
          <continueOnError>false</continueOnError>
          <failOnError>true</failOnError>
          <alwaysPublishFromMaster>false</alwaysPublishFromMaster>
          <hostConfigurationAccess class="jenkins.plugins.publish_over_ssh.BapSshPublisherPlugin" reference="../.." />
          <paramPublish class="jenkins.plugins.publish_over_ssh.BapSshParamPublish" plugin="publish-over-ssh@1.22">
            <parameterName><%= build.parameterName %></parameterName>
          </paramPublish>
        </delegate>
      </delegate>
    </jenkins.plugins.publish__over__ssh.BapSshBuilderPlugin>
    <hudson.tasks.Shell>
      <command><%= build.postCommand %></command>
      <configuredLocalRules />
    </hudson.tasks.Shell>
  </builders>
  <publishers />
  <buildWrappers>
    <jenkins.plugins.nodejs.NodeJSBuildWrapper plugin="nodejs@1.3.11">
      <nodeJSInstallationName><%= wrappers.node %></nodeJSInstallationName>
      <cacheLocationStrategy class="jenkins.plugins.nodejs.cache.DefaultCacheLocationLocator" />
    </jenkins.plugins.nodejs.NodeJSBuildWrapper>
  </buildWrappers>
</project>
`

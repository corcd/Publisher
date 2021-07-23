/*
 * @Author: Whzcorcd
 * @Date: 2021-07-21 10:38:48
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-23 15:47:53
 * @Description: file content
 */
import ejs from 'ejs'
import config from '@/templates/jenkins/config'

const defaultOptions = (symbol = '') => {
  return {
    projectName: '',
    description: '',
    wrappers: {
      node: 'node12'
    },
    parameters: [
      {
        model: 'hudson.model.ChoiceParameterDefinition',
        key: 'HOSTNAME',
        description: '构建环境',
        value: [
          'development',
          'preview',
          'production',
          'hgcloud/pretest',
          'hgcloud/production'
        ]
      },
      {
        model: 'hudson.model.ChoiceParameterDefinition',
        key: 'SCRIPT',
        description: '构建命令',
        value: ['build:dev', 'build:pre', 'build:prod', 'build:huawei']
      }
    ],
    source: {
      url: '',
      credentialsId: 'gitlab'
    },
    build: {
      prevCommand: `node -v
yarn
yarn $SCRIPT
cd dist
tar -zcvf dist.tar.gz ./*`,
      parameterName: 'HOSTNAME',
      publishers: [
        {
          label: 'development',
          server: 'frontend-consoles-server(development)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/consoles/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'preview',
          server: 'frontend-consoles-server(preview)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/consoles/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'production',
          server: 'frontend-consoles-server(production)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /www/project_content/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'hgcloud/production',
          server: 'hgcloud-frontend-web-server(production)',
          remoteDirectory: `/consoles/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/consoles/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        }
      ],
      postCommand: `rm -f dist.tar.gz`
    }
  }
}

const pindaoOptions = (symbol = '') => {
  return {
    build: {
      publishers: [
        {
          label: 'development',
          server: 'frontend-consoles-server(development)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/consoles/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'preview',
          server: 'frontend-consoles-server(preview)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/consoles/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'production',
          server: 'frontend-consoles-server(production)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /www/project_content/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'hgcloud/production',
          server: 'hgcloud-frontend-web-server(production)',
          remoteDirectory: `/consoles/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/consoles/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'development',
          server: 'frontend-pindao-server(development)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/pindao/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'preview',
          server: 'frontend-pindao-server(preview)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/pindao/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        },
        {
          label: 'production',
          server: 'frontend-pindao-server(production)',
          remoteDirectory: `/${symbol}`,
          sourceFiles: 'dist/dist.tar.gz',
          removePrefix: 'dist',
          execCommand: `cd /var/www/pindao/${symbol}
tar -zxvf dist.tar.gz -C ./
rm -f dist.tar.gz`
        }
        // TODO 华广云频道配置
      ]
    }
  }
}

const isObj = x => {
  const type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

const toObject = val => {
  if (val === null || typeof val === 'undefined') {
    throw new TypeError('Cannot convert undefined or null to object')
  }
  return Object(val)
}

function assign(to, from) {
  if (to === from) {
    return to
  }

  // eslint-disable-next-line no-shadow
  const assignKey = (to, from, key) => {
    const val = from[key]
    if (val === null || typeof val === 'undefined') {
      return
    }

    if (Object.hasOwnProperty.call(to, key)) {
      if (typeof to[key] === 'undefined' || to[key] === null) {
        throw new TypeError(
          'Cannot convert undefined or null to object (' + key + ')'
        )
      }
    }

    if (!Object.hasOwnProperty.call(to, key) || !isObj(val)) {
      to[key] = val
    } else {
      to[key] = assign(Object(to[key]), from[key])
    }
  }
  const temp = Object(from)

  for (const key in temp) {
    if (Object.hasOwnProperty.call(temp, key)) {
      assignKey(to, temp, key)
    }
  }

  if (Object.getOwnPropertySymbols) {
    const symbols = Object.getOwnPropertySymbols(temp)

    for (let i = 0; i < symbols.length; i++) {
      if (Object.propIsEnumerable.call(temp, symbols[i])) {
        assignKey(to, temp, symbols[i])
      }
    }
  }

  return to
}

const deepAssign = (target, ...source) => {
  const temp = toObject(target)
  for (let s = 0; s < source.length; s++) {
    assign(target, source[s])
  }
  return temp
}

export const getDefaultOptions = symbol =>
  Object.assign({}, defaultOptions(symbol))

export const getProjectConfig = (symbol, options, isPindao = false) => {
  const treatedOptions = deepAssign(
    defaultOptions(symbol),
    options,
    isPindao ? pindaoOptions(symbol) : {}
  )

  console.log(treatedOptions)
  return ejs.render(config, treatedOptions)
}

export default {
  getProjectConfig
}

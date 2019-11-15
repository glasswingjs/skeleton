import 'reflect-metadata'
import {expect} from 'chai'
import {IncomingMessage} from 'http'
import {container} from 'tsyringe'
import YAML from 'yaml'

import {MockRequest} from './mock'
import {Body, methodArgumentsDescriptor, Param, Query, Request} from '../src'

const bodyObject = {
  test: 'testValue',
  test2: 'testValue2',
}

class TestController {
  hasBodyAsArgument(@Body() body: any) {}

  hasYamlBodyAsArgument(@Body(undefined, YAML.parse) body: any) {}

  hasBodyKeyAsArgument(@Body('test') body: any) {}

  hasYamlBodyKeyAsArgument(@Body('test', YAML.parse) body: any) {}

  hasParamAsArgument(@Param() params: any) {}

  hasParamKeyAsArgument(@Param('test') param: any) {}

  hasQueryAsArgument(@Query() params: any) {}

  hasQueryKeyAsArgument(@Query('test') param: any) {}
}

const hmd = (key: string, target: any) => Reflect.hasMetadata(methodArgumentsDescriptor(key), target)

const gmd = (key: string, target: any) => Reflect.getMetadata(methodArgumentsDescriptor(key), target)

const req = (): Request => {
  return new MockRequest(
    {
      headers: {
        cookie: '',
      },
      method: 'GET',
      url: '/test?test=testValue&test2=testValue2',
    },
    JSON.stringify(bodyObject),
  )
}

const reqYaml = (): Request =>
  new MockRequest(
    {
      headers: {},
      method: 'GET',
      url: '/test?test=testValue&test2=testValue2',
    },
    YAML.stringify(bodyObject),
  )

describe('lib/controller/decorator/argument-injector => *', () => {
  describe('Body(key:? string, decoder?: RequestBodyDecoder) => ', () => {
    let controller: TestController

    beforeEach(() => {
      controller = new TestController()
    })

    it('@Body() => Should add a @Body argument descriptor with `request` source', () => {
      expect(hmd('hasBodyAsArgument', controller)).to.be.true
      const metadata = gmd('hasBodyAsArgument', controller)
      expect(metadata.length).to.equal(1)
      expect(metadata[0].source).to.be.a('string')
      expect(metadata[0].source).to.equal('request')
    })

    it('@Body() =>  Should add a @Body argument containing the entire body object', done => {
      const metadata = gmd('hasBodyAsArgument', controller)
      expect(metadata).to.be.an('array')
      metadata[0]
        .callable(req())
        .then((data: any) => {
          expect(data).to.be.an('object')
          expect(data.test).to.be.a('string')
          expect(data.test).to.equal(bodyObject.test)
          expect(data.test2).to.equal(bodyObject.test2)
        })
        .then(done)
    })

    it('@Body(undefined, YAML.parse) =>  Should add a @Body argument containing the entire body object', done => {
      const metadata = gmd('hasYamlBodyAsArgument', controller)
      expect(metadata).to.be.an('array')
      metadata[0]
        .callable(reqYaml())
        .then((data: any) => {
          expect(data).to.be.an('object')
          expect(data.test).to.be.a('string')
          expect(data.test).to.equal(bodyObject.test)
          expect(data.test2).to.equal(bodyObject.test2)
        })
        .then(done)
    })

    it('@Body(`test`) => Should add a @Body argument containing the value for `test` key', done => {
      const metadata = gmd('hasBodyKeyAsArgument', controller)
      expect(metadata).to.be.an('array')
      metadata[0]
        .callable(req())
        .then((data: string) => {
          expect(data).to.be.a('string')
          expect(data).to.equal(bodyObject.test)
        })
        .then(done)
    })

    it('@Body(`test`, YAML.parse) => Should add a @Body argument containing the value for `test` key', done => {
      const metadata = gmd('hasYamlBodyKeyAsArgument', controller)
      expect(metadata).to.be.an('array')
      metadata[0]
        .callable(reqYaml())
        .then((data: string) => {
          expect(data).to.be.a('string')
          expect(data).to.equal(bodyObject.test)
        })
        .then(done)
    })
  })

  // describe('Cookie(key:? string, value?: string) => ', () => {
  //   it('@Cookie() => Should return return an object (even if cookies is empty)', () => {})

  //   it('@Cookie(`test`) => Should return value for key `test`', () => {})

  //   it('@Cookie(`test`, `test`) => Should set value `test` for key `test`', () => {})

  //   it('@Cookie(undefined, `test`) => Should throw an error', () => {})
  // })

  // describe('Header(key:? string, value?: string) => ', () => {
  //   it('@Header() => Should return return an object (even if headers is empty)', () => {})

  //   it('@Header(`test`) => Should return value for key `test`', () => {})

  //   it('@Header(`test`, `test`) => Should set value `test` for key `test`', () => {})

  //   it('@Header(undefined, `test`) => Should throw an error', () => {})
  // })

  // describe('Ip() => ', () => {
  //   it('@Header() => Should return return an string', () => {})
  // })

  describe('Param(key:? string) => ', () => {
    let controller: TestController

    beforeEach(() => {
      controller = new TestController()
    })

    it('@Param() => Should add a @Param argument descriptor with `params` source', () => {
      expect(hmd('hasParamAsArgument', controller)).to.be.true
      const metadata = gmd('hasParamAsArgument', controller)
      expect(metadata.length).to.equal(1)
      expect(metadata[0].source).to.be.a('string')
      expect(metadata[0].source).to.equal('params')
    })

    it('@Param() => Should add a @Param argument containing the entire params object', () => {
      const metadata = gmd('hasParamAsArgument', controller)
      expect(metadata).to.be.an('array')
      const data = metadata[0].callable(bodyObject)
      expect(data).to.be.an('object')
      expect(data.test).to.be.a('string')
      expect(data.test).to.equal(bodyObject.test)
      expect(data.test2).to.equal(bodyObject.test2)
    })

    it('@Param(`test`) => Should add a @Param argument containing the value for `test` key from the `params` object', () => {
      const metadata = gmd('hasParamKeyAsArgument', controller)
      expect(metadata).to.be.an('array')
      const data = metadata[0].callable(bodyObject)
      expect(data).to.be.a('string')
      expect(data).to.equal(bodyObject.test)
    })
  })

  describe('Query(key:? string) => ', () => {
    let controller: TestController

    beforeEach(() => {
      controller = new TestController()
    })

    it('@Query() => Should add a @Query argument descriptor with `query` source', () => {
      expect(hmd('hasQueryAsArgument', controller)).to.be.true
      const metadata = gmd('hasQueryAsArgument', controller)
      expect(metadata.length).to.equal(1)
      expect(metadata[0].source).to.be.a('string')
      expect(metadata[0].source).to.equal('request')
    })

    it('@Query() => Should add a @Query argument containing the entire `query` object', () => {
      const metadata = gmd('hasQueryAsArgument', controller)
      expect(metadata).to.be.an('array')
      const data = metadata[0].callable(req())
      expect(data).to.be.an('object')
      expect(data.test).to.be.a('string')
      expect(data.test).to.equal(bodyObject.test)
      expect(data.test2).to.equal(bodyObject.test2)
    })

    it('@Query(`test`) => Should add a @Query argument containing the value for `test` key from the `query` object', () => {
      const metadata = gmd('hasQueryKeyAsArgument', controller)
      expect(metadata).to.be.an('array')
      const data = metadata[0].callable(req())
      expect(data).to.be.a('string')
      expect(data).to.equal(bodyObject.test)
    })
  })

  // describe('Req() => ', () => {
  //   it('@Req() => Should return return an object', () => {})
  // })

  // describe('Res() => ', () => {
  //   it('@Res() => Should return return an object', () => {})
  // })
})

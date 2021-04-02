jest.mock('../../services/data/evaluate.worker')
jest.mock('../../services/common/logging')

import { newSpecPage } from '@stencil/core/testing'
import { actionBus, eventBus } from '../../services/actions'
import {
  contentStateDispose,
  contentStateReset,
} from '../../services/content'
import {
  addDataProvider,
  clearDataProviders,
} from '../../services/data/factory'
import { DATA_EVENTS } from '../../services/data/interfaces'
import { InMemoryProvider } from '../../services/data/providers/memory'
import {
  dataState,
  dataStateDispose,
  dataStateReset,
} from '../../services/data/state'
import { ContentInclude } from './content-include'

describe('n-content', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    jest.resetAllMocks()
    session = new InMemoryProvider()
    addDataProvider('session', session)
    contentStateReset()
    dataStateReset()
    dataState.enabled = true
  })

  afterEach(() => {
    actionBus.removeAllListeners()
    eventBus.removeAllListeners()
    clearDataProviders()
    contentStateDispose()
    dataStateDispose()
  })

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
      html: `<n-content-include></n-content-include>`,
    })
    expect(page.root).toEqualHtml(`
      <n-content-include hidden="">
      </n-content-include>
    `)
  })

  it('renders html from remote', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    page.setContent(
      `<n-content-include src="fake.html"></n-content-include>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-include>
    `)

    const subject = page.body.querySelector('n-content')
    subject?.remove()
  })

  it('handles erroring html from remote', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.reject('Error!'),
      }),
    )

    page.setContent(
      `<n-content-include src="fake.html"></n-content-include>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include hidden="" src="fake.html">
       </n-content-include>
    `)

    const subject = page.body.querySelector('n-content')
    subject?.remove()
  })

  it('handles http error in html from remote', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 400,
        text: () => Promise.resolve('Error!'),
      }),
    )

    page.setContent(
      `<n-content-include src="fake.html"></n-content-include>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include hidden="" src="fake.html">
       </n-content-include>
    `)

    const subject = page.body.querySelector('n-content')
    subject?.remove()
  })

  it('renders html from remote, delayed', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    // @ts-ignore
    page.win.Prism = {
      highlightAllUnder: jest.fn().mockImplementation(),
    }

    page.setContent(
      `<n-content-include defer-load src="fake.html"></n-content-include>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include defer-load hidden="" src="fake.html">
       </n-content-include>
    `)

    const subject = page.body.querySelector('n-content-include')
    subject?.removeAttribute('defer-load')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-include>
    `)

    subject?.remove()
  })

  it('renders html conditionally', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    await page.setContent(
      `<n-content-include when="false" src="fake.html"></n-content-include>`,
    )

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include when="false" hidden="" src="fake.html">
      </n-content-include>
    `)

    const subject = page.body.querySelector('n-content-include')
    subject?.setAttribute('when', 'true')

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include when="true" src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-include>
    `)

    subject?.remove()
  })

  it('renders html conditionally, from data expression', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<h1>HI WORLD!</h1> `),
      }),
    )

    await page.setContent(
      `<n-content-include when="{{session:render}}" src="fake.html"></n-content-include>`,
    )

    expect(page.root).toEqualHtml(`
      <n-content-include when="{{session:render}}" hidden="" src="fake.html">
      </n-content-include>
    `)

    await session.set('render', 'true')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include when="{{session:render}}" src="fake.html">
        <div class="remote-content">
          <h1>
          HI WORLD!
          </h1>
        </div>
      </n-content-include>
    `)

    const subject = page.body.querySelector('n-content')
    subject?.remove()
  })

  it('renders tokens in remote data', async () => {
    const page = await newSpecPage({
      components: [ContentInclude],
    })

    page.win.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          Promise.resolve(`<h1>HI {{session:name?FRIEND}}!</h1> `),
      }),
    )

    await page.setContent(
      `<n-content-include src="fake.html"></n-content-include>`,
    )

    expect(page.root).toEqualHtml(`
      <n-content-include src="fake.html">
        <div class="remote-content">
          <h1>
            HI FRIEND!
          </h1>
        </div>
      </n-content-include>
    `)

    await session.set('name', 'MAX')
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: 'session',
    })

    await page.waitForChanges()

    expect(page.root).toEqualHtml(`
      <n-content-include src="fake.html">
        <div class="remote-content">
          <h1>
          HI MAX!
          </h1>
        </div>
      </n-content-include>
    `)

    const subject = page.body.querySelector('n-content')
    subject?.remove()
  })
})
import { EventAction } from '../actions/interfaces'
import { commonState, debugIf } from '../common'
import { IEventEmitter } from '../common/interfaces'
import {
  LocationSegments,
  MatchResults,
  ROUTE_EVENTS,
} from '../routing/interfaces'
import { Route } from '../routing/route'
import { RouterService } from '../routing/router'
import {
  NavigateNext,
  NavigateTo,
  NAVIGATION_COMMANDS,
  NAVIGATION_TOPIC,
} from './interfaces'

export class NavigationActionListener {
  private readonly removeSubscription!: () => void

  constructor(
    private router: RouterService,
    private events: IEventEmitter,
    private actions: IEventEmitter,
  ) {
    this.removeSubscription = this.actions.on(NAVIGATION_TOPIC, e => {
      this.handleEventAction(e)
    })
  }

  notifyRouteChanged(location: LocationSegments) {
    this.events.emit(ROUTE_EVENTS.RouteChanged, location)
  }

  notifyRouteFinalized(location: LocationSegments) {
    this.events.emit(ROUTE_EVENTS.RouteFinalized, location)
  }

  notifyMatch(route: Route, match: MatchResults) {
    this.events.emit(ROUTE_EVENTS.RouteMatched, {
      route,
      match,
    })
  }

  notifyMatchExact(route: Route, match: MatchResults) {
    this.events.emit(ROUTE_EVENTS.RouteMatchedExact, {
      route,
      match,
    })
  }

  handleEventAction(
    eventAction: EventAction<NavigateTo | NavigateNext>,
  ) {
    debugIf(
      commonState.debug,
      `route-listener: action received ${JSON.stringify(
        eventAction,
      )}`,
    )

    switch (eventAction.command) {
      case NAVIGATION_COMMANDS.goNext: {
        this.router.goToParentRoute()
        break
      }
      case NAVIGATION_COMMANDS.goTo: {
        const { path } = eventAction.data as NavigateTo
        this.router.goToRoute(path)
        break
      }
      case NAVIGATION_COMMANDS.goBack: {
        this.router.goBack()
        break
      }
    }
  }

  destroy() {
    this.removeSubscription()
  }
}

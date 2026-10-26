import type { AgencyApp } from '../AgencyApp';
import { shellView } from './shell';
import { homeView } from './home';
import { talentsView } from './talents';
import { talentView } from './talent';
import { pitchView, historyView, accountView } from './records';
import { calendarView, overlaysView } from './calendar';

/** Builds the flat view model that every screen reads from. */
export function buildView(app: AgencyApp) {
  return {
    ...shellView(app),
    ...homeView(app),
    ...talentsView(app),
    ...talentView(app),
    ...pitchView(app),
    ...historyView(app),
    ...accountView(app),
    ...calendarView(app),
    ...overlaysView(app),
  };
}

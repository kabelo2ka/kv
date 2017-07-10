import { KasivibePage } from './app.po';

describe('kasivibe App', () => {
  let page: KasivibePage;

  beforeEach(() => {
    page = new KasivibePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

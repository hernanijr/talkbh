import assert from 'node:assert/strict';
import test from 'node:test';
import { detectBrowserLanguage, shouldSuggestLanguage } from '../src/data/language.ts';

test('browser language detection selects the first supported language', () => {
  assert.equal(detectBrowserLanguage(['fr-FR', 'en-GB', 'pt-BR']), 'en');
  assert.equal(detectBrowserLanguage(['pt-PT', 'en']), 'pt-BR');
  assert.equal(detectBrowserLanguage(['fr-FR']), undefined);
});

test('language suggestion respects current page, saved choice and dismissal', () => {
  assert.equal(shouldSuggestLanguage('pt-BR', 'en', null, false), true);
  assert.equal(shouldSuggestLanguage('pt-BR', 'pt-BR', null, false), false);
  assert.equal(shouldSuggestLanguage('pt-BR', 'en', 'en', false), false);
  assert.equal(shouldSuggestLanguage('pt-BR', 'en', null, true), false);
});

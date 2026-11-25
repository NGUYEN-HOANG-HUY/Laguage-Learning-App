import assert from 'node:assert/strict';
import test from 'node:test';

import { sampleDialogueTrees, sampleLessons, sampleVocabulary } from './sampleContent.ts';

test('sample English vocabulary has context, level, collocations, and explanations', () => {
  assert.equal(sampleLessons.length, 3);
  assert.ok(sampleVocabulary.length >= 9);
  assert.ok(sampleVocabulary.every((item) => item.language === 'en'));
  assert.ok(sampleVocabulary.every((item) => item.example.text.length > 0));
  assert.ok(sampleVocabulary.every((item) => item.collocations.length > 0));
  assert.ok(sampleVocabulary.every((item) => item.grammarNote.length > 0));
});

test('both scenario dialogue trees have valid reachable choices and endings', () => {
  assert.equal(sampleDialogueTrees.length, 2);

  for (const tree of sampleDialogueTrees) {
    const nodeById = new Map(tree.nodes.map((node) => [node.id, node]));
    assert.ok(nodeById.has(tree.startNodeId));
    assert.ok(tree.nodes.every((node) => node.choices.length >= 2));
    assert.ok(
      tree.nodes
        .flatMap((node) => node.choices)
        .every(
          (choice) =>
            choice.nextNodeId === null || nodeById.has(choice.nextNodeId),
        ),
    );
    assert.ok(
      tree.nodes
        .flatMap((node) => node.choices)
        .some((choice) => choice.nextNodeId === null),
    );
  }
});

# mutable-default-shared-object-leak

## Must not report
- Do not flag the helper as over-abstracted; the bug is shared object identity, not function count.
- Do not recommend freezing the object unless the call sites can tolerate immutable inputs.

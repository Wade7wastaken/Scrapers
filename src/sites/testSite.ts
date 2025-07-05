import { Console, Effect } from "effect";
import type { Game } from "../main";

export const run: Effect.Effect<Game[]> = Effect.gen(function* () {
    return []
});

export const displayName = "Test Site";

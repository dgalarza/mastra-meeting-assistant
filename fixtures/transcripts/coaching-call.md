# Coaching Call — 2026-04-14

**Participants:** Damian (coach), Jane (client / engineering lead at Holloway)

---

**Damian:** Alright Jane, where do you want to start today? Last week we left off
on the eval rubric you were sketching out for the support classifier.

**Jane:** Yeah, I made some progress. I have a draft. Honestly it feels rough —
I'd love for you to look at it and tell me where it's off. I'll send it over
right after this call.

**Damian:** Sure. Send it today and I'll get you written comments back by
Monday morning. That'll give you the week to react.

**Jane:** Perfect. While we're on it — I want to share something I've been
chewing on. I'm trying to decide between two architectures for the agent. One
is the multi-agent supervisor pattern we talked about. The other is just a
single agent with tool access. I keep going back and forth.

**Damian:** Both can work. The question is how isolated the sub-tasks are. If
your sub-tasks share state heavily, multi-agent gets messy fast. If they're
clean handoffs, supervisor is cleaner.

**Jane:** Right. I think I need to actually write up the decision — pros, cons,
which way I'm leaning, why. Otherwise I'll just keep spinning. Let me put
together a doc and share it with you. I can have a draft to you by end of
next week.

**Damian:** Good. Write it for yourself first, not for me. The point of the
doc is to force the choice, not to convince anyone.

**Jane:** Yeah. Got it.

**Damian:** One thing I'd add — once you have the architecture written down,
make sure you've got a CLAUDE.md that reflects it. The agent's behavior is
half the model, half the context you give it.

**Jane:** Speaking of which, do you have a CLAUDE.md template you've been
using? I've seen yours in the videos but I haven't seen the actual file.

**Damian:** I do. Let me send you the one I use for client work — it's a
better starting point than the example in the docs. I'll get it over by Friday.

**Jane:** Awesome, thanks.

**Damian:** Anything else on your plate this week?

**Jane:** Honestly, the big one is just shipping the v1 of the classifier so
the support team can actually use it. We're close. I think we could probably
revisit the auth flow next quarter if we have budget — there's some weirdness
with token refresh — but it's not blocking anything right now.

**Damian:** Don't touch the auth flow if it's not blocking. You'll have time.

**Jane:** Yeah. Also — we keep talking about migrating off Pinecone eventually.
Cost is creeping up. I know it's not urgent but it's on my mind.

**Damian:** Add it to your tech debt list. Don't make it a project this quarter.
There's no story you can tell your team that justifies it right now.

**Jane:** Fair. Last thing — if we get the budget approval, we might bring in
a second consultant for the data pipeline work. I'll know in two weeks. I'll
loop you in if it happens.

**Damian:** Good. Don't pre-commit anything to that. Move forward as if it
won't happen and adjust if it does.

**Jane:** Makes sense.

**Damian:** Okay. Same time next week?

**Jane:** Yes — let me get it on the calendar before I forget. I'll send a
new invite for next Tuesday at the same time.

**Damian:** Sounds good. Send the rubric over and I'll have comments by Monday.

**Jane:** Will do. Thanks Damian.

**Damian:** Talk soon.

---

*[End of recording]*

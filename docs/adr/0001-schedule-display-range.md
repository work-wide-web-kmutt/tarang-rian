# Preserve Session Intervals When Clipping Schedule Views

The timetable uses one global, persisted display range for both interactive and visual exports. Sessions are clipped to that range for rendering, but their stored intervals remain unchanged, because a view preference must not rewrite schedule data and the same session must become fully visible when range expands.

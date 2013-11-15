---
layout: post
title: Editing videos with Blender
---
[Blender] is an Open Source 3D modelling- and animation tool.  
-- Today I found out it also does video editing!

[Blender]: http://blender.org

_Blender also does video composition (coloring) and has a built-in game engine,
enabling you to create games with Blender. This post is based on Blender version
2.69_

I had a small video I wanted to edit. And I don't want to buy one those
expensive large video editing suite. The free alternatives [kdenlive] and
[Openshot] both need to be compiled on Mac. That's probably at least a one hour
wait time before I can start video editing, and furthermore I have to fix
dependencies and build flags.  That's not something I wanna spend my time on.

[kdenlive]: http://www.kdenlive.org/
[Openshot]: http://www.openshotvideo.com/

Blender to the rescue
---------------------

The first thing you need to do in order to use Blender as a video editor is to
switch the window layout to "Video Editing". (There's a dropdown in the top menu
bar)

Now you can drag video files and images into the timeline. (The timeline is
called the `Video Sequence editor`)
The imported clips and images will be placed at the time slider (the green
vertical line on the timeline)
**Left clicking** on the timeline sets the time slider, and updates the scene view
accordingly. This also means you cannot move clips in the timeline by clicking
and dragging them.

Each clip is called a `Strip`.

You select clips in the timeline by **Right clicking**.
Moving clips is done by pressing **G** [Grab] (don't actually drag the clips, just
move the mouse, and the clips will move). Left-click to end the move.
Right-click to cancel the move.

> Pressing **G** again will change the "move" mode. The default state is that if
> you move a clip on top of another the other clip will be cut (shortened).  The
> other mode (you toggle by pressing **G**) will not cut (shorten) other clips,
> but simply move them to make space for the moved clip.

The layers are shown 0, 1.. bottom up in the timeline. Clips in layer 1 will be
on top of clips in layer 0, and are overlayed according to the clip's `blend`
property. I recommend the `Over Drop` settings that simply draws the clip on top
of the other.

The layers are called `Channels` and can be seen as a property on each clip.

You can play your current composition by pressing `Alt-A`. I recommend choosing
the _Sync Mode_ called `AV Sync`. Otherwise while you play the video and
audio will go out of sync. This also means that the time slider doesn't show the
correct position. In principle `Frame dropping` should be better, but it didn't
work for me.

Picture-in-picture (PIP)
------------------------
To scale a clip, you can add a transform by selecting the clip, then in the menu
below the timeline `Add > Effect Strip... > Transform`.
You can then select the Transform clip and choose the settings for the effect.

The values of the effect can be changed by clicking the value and dragging left
and right.

Saving the movie
----------------
As Blender is mainly a 3D Modeller/animator saving your movie is called rendering.
In the lower left corner of every window "tile", you can choose what editor
should be in this tile. Rendering can be done from the _Properties_ editor. The
first pane of the Properties editor is a small camera icon: this is the
rendering pane. Here you can choose the output format, frames per second and so
on.

Rendering can be stopped by pressing `ESC`. The frames rendered so far will be
saved to the file (i.e. they will not be lost).

Audio sync problem
------------------
When you import a movie clip it is split up into a video and an audio part. When
I did this, I got a video part with 13151 frames but the audio part only had
12625 frames. This was because my render was set to be 24 frames per second but
the imported movie had 25 frames per second. Blender matches the frames of the
imported video 1:1 to the frames in the render. This in effect stretched the
imported video to be longer than its original length and thus longer than the
imported audio. I fixed this by setting the render to have 25 frames per second.

Thoughts about Blender
----------------------
Blender is an awesome powerful tool -- 3d modeling, 3d animation, compositing,
video editing, and even a game engine is included in Blender.

But Blender is not for the faint of heart. The interface (in my opinion) is not
optimized for newcomers or intuitive use. Rather it is optimized for effective
use by experts. This means you have to accept things such as not being able to
drag clips in the timeline directly as would be intuitively expected.

Because of this, I see as tool Blender similar to Vim -- powerful, but with a
tough learning curve.

Thank you Blender!

**Last note**

For small clips I found it hard to select (click) the left and right handles
(the beginning and end of the clip). Luckily there's a menu below the timeline
called `Select` which has a `Right Handle` and a `Left Handle` item. By
right-clicking on either of those you can assign a keyboard shortcut to that
menu item.

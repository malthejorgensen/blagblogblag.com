---
layout: post
title: Editing videos with Blender
---
[Blender] is an Open Source 3D modelling- and animation tool.  
-- Today I found out it also does video editing!

[Blender]: https://blender.org

_This post is based on Blender version 2.69_

It is [well known](https://www.youtube.com/watch?v=Sh-cnaJoGCw&t=28m50s) that the
Open Source community has yet to produce decent video editing software.  But
being stubborn and this being a small project I didn't want to buy one of those
large, expensive video editing suites.

[kdenlive]: https://www.kdenlive.org/
[Openshot]: https://www.openshotvideo.com/

Blender to the rescue
---------------------
In order to use Blender as a video editor the first thing you need to do, is to
switch the window layout to "Video Editing". (There's a dropdown in the top menu
bar)

<a href="img/blender-screenshot-full.png">
<img alt="Screenshot of Blenders window layout menu" src="img/blender-screenshot-cropped.png" style="display:block; float:none">
</a>

In this view you should be able to see the timeline at the bottom of the window.
Here you can drag video files and images into your movie project's timeline. The
timeline is called the `Video Sequence editor` in "Blender speak".
The imported clips and images will be placed at the time slider (the green
vertical line on the timeline)

**Left clicking** on the timeline sets the time slider and updates the scene
view accordingly. The scene view is a preview of a specific frame in your
movie project. This also means that _you cannot move clips in the timeline by
clicking and dragging them_.

Each clip is called a `Strip`.

You select strips in the timeline by **Right clicking**.
Moving strips is done by pressing **G** [Grab]. Having selected one or multiple
strips by right clicking, and then pressing G, the selected strips will follow your
mouse as if you were dragging. You should not hold down any mouse or keyboard
button while doing this.  
Left-click to end the move. Right-click to cancel the move.

> Pressing **G** while moving strips will change the "move" mode. The default
> state is that if you move a strip on top of another the other strip will be cut
> (shortened).  The other mode will not shorten other strips, but simply move
> them to make space for the moved strip.

To shorten or lengthen a strip you can select one of the "handles" (the small
triangles) at each end of the strip and moving them same way you select and
move the whole strip.

When you have selected a strip you should see a panel to the right of the
timeline called "Edit Strip". In this panel you can edit the properties of the
strip. For example you can choose whether it should be played forwards or
backwards, or that only every second frame should be shown (this is called
`Strobe`).

When you add a strip to the timeline it is placed in a specific layer.  These
layers are called `Channels` by Blender and are shown in the timeline as 0, 1,
2... on the left-hand side. Strips in channel 1 will
be on top of strips in channel 0, strips in channel 2 will be on top of
strips in channel 1, and so on.  The strips are drawn on top of eachother
in according to the strip's `blend` property. I recommend the `Over Drop`
settings that simply draws the strip on top of the other without any blending.

You can watch your current movie project by pressing `Alt-A`. I recommend
choosing the _Sync Mode_ called `AV Sync`. Otherwise you risk the video and
audio going out of sync while you watch your project, and the time slider might
not show the correct position. In principle the `Frame dropping` setting for the
Sync Mode should be better, but it didn't work for me.  
To find the Sync Mode menu look for the text "No Sync" at the bottom of the
Blender window.

Picture-in-picture (PIP)
------------------------
To scale a strip (make it smaller or larger), you can add a transform by
selecting the strip, then in the menu below the timeline `Add > Effect Strip...
> Transform`.  You can then select the Transform strip and choose the settings
for the effect.

The values of the effect can be changed by clicking the value and dragging left
and right.

Saving the movie
----------------
As Blender is mainly a 3D modelling and 3D animating tool, saving your movie is
called "rendering".  In the lower left corner of every window "tile" (the scene
view and the timeline for example), you can choose what kind of editor should be
shown in this tile. Rendering can be done from the an editor called _Properties_.
The first pane of the Properties editor is a small camera icon: this is the
rendering pane.  Here you can choose the output format, frames per second and so
on.

Rendering can be stopped by pressing `ESC`. The frames rendered so far will be
saved to the file (i.e. they will not be lost).

Audio sync problem
------------------
When you import a movie strip it is split into a video and an audio part. When
I did this, I got a video part with 13151 frames but the audio part only had
12625 frames. This was because my render was set to be 24 frames per second but
the imported movie had 25 frames per second. Blender matches the frames of the
imported video 1:1 to the frames in the render. This stretched the
imported video to be longer than its original length and thus longer than the
imported audio. I fixed this by setting the render to have 25 frames per second.

Thoughts about Blender
----------------------
Blender is an awesome powerful tool -- 3d modeling, 3d animation, compositing,
video editing, and even a game engine is included in Blender.

But Blender is not for the faint of heart. The interface (in my opinion) is not
optimized for newcomers or intuitive use. Rather it is optimized for effective
use by experts. This means you have to accept things such as not being able to
drag strips in the timeline by holding down the mouse, and that saving
your movie is done via the "Properties" editor.

Because of this, I see as tool Blender similar to Vim -- powerful, but with a
tough learning curve.

Thank you Blender!

**Last note**

For small strips I found it hard to select (click) the left and right handles
(the beginning and end of the strip). Luckily there's a menu below the timeline
called `Select` which has a `Right Handle` and a `Left Handle` item. By
right-clicking on either of those you can assign a keyboard shortcut to that
menu item.

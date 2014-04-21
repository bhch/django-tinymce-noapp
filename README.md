django-tinymce-noapp
====================

**Add TinyMCE to your django app's textareas WITHOUT USING ANY APPS OR HACKS!**

Contents
--------
**1. How to**

**2. Adding TinyMCE to only specific textareas**

**3. Issues & Fixes**

**4. Tested with & "not-with"**

**5. Not working?** 

## Here's how to do that

First up, download TinyMCE.

#### In case of TinyMCE 3.x:
Extract the `tiny_mce` folder (which would be inside `tinymce\jscripts\` directory) to your project's `static`
directory.

#### In case of TinyMCE 4.x:
Extract the `tinymce` folder (which would be inside `tinymce\js\` directory) to your project's `static` directory.

**Or you can use both the versions together, too!**

Now create a new folder inside your `static` directory and give it a short and sweet name like `js`. 
This is going to be the folder where your TinyMCE configuration script would be resting.

So go ahead, create a configuration JavaScript file for your TinyMCE and keep it inside `static\js\`.

To save you from the labour, I have created two configuration files, called `tinymce_4_config.js` and
`tinymce_3_config.js`.
Download them and save them inside your `static\js\` directory.

#### Using the mighty `class Media`

Open the `admin.py` file of your app and now is the time to use `ModelAdmin`'s powerful `class Media`, which is the main
reason for holding us back from using any additional app and from hacking admin's templates! 

To your `ModelAdmin` add the following:

**For TinyMCE 3.x:**

    class Media:
        js = ('tiny_mce/tiny_mce.js', 'js/tinymce_3_config.js') # The tiny_mce.js is already minified, so don't worry.
        # Make sure you maintain the above order as the main TinyMCE
        # script has to be loaded before our configuration script.
        # It won't work otherwise.

**For TinyMCE 4.x:**

    class Media:
        js = ('tinymce/tinymce.min.js', 'js/tinymce_4_config.js')
        # Make sure you maintain the above order as the main TinyMCE
        # script has to be loaded before our configuration script.
        # It won't work otherwise.

##### Now, start your server and adore the new and lovely texareas of your apps!

#### If you're using your own configuration files
In that case, there is one thing you need to take care of: The `selector` option in your configuration script.
For both, TinyMCE 3.x and 4.x, it should be `selector: "texarea",`. 
By using the `selector` option, you can get rid of the `mode` and `elements` options. The code gets shorter!

##### However, this would add TinyMCE to all the textareas on that page. See next section to know how to control that.

## Adding TinyMCE only to specific textareas

To add TinyMCE only to a particular textarea, you need to add `id` of that textarea to the `selector` option.
To know how django assigns `id` to a particular form field is very simple. If you take a look at the source code of the
"edit/add" page of your app in django admin, you'd know.
What django does is it takes the name of your form field and prefixes it with "id_" and this value is assigned to the
`id`.

##### Here's a concrete example:

**`models.py`**

    class Post(models.Model):
        ...
        content_main = models.TextField()
        content_extra = models.TextField()
        ...

Now, by looking at the names of the `TextField`s, we can tell their `id`s which are going to be "id_content_main" and "id_content_extra", respectively.
Now, if you want to add TinyMCE to the `content_main` textarea (or `TextField`) only, all you have to do is in your TinyMCE configuration file, 
replace `selector: "textarea",` with `selector: "#id_content_main",` The leading hash is necessary.
**And you're done!**

## Issues & Fixes

**Mainly, the issues that I have discovered are with TinyMCE 4.x.**

**NOTE: The first two issues are found when using TinyMCE 4.x with django's default admin interface**
**In case you're using django-admin-bootstrapped, skip to the third issue.**

### Issue #1

If you're using TinyMCE 4.x (well I tested version 4.0.11 only) with django's default admin interface, you will notice
that the `label` for your `texarea` (or name of your `TextField`, as in django) won't show up.

### Fix

For that you might want to either use TinyMCE 3.x (and it matches perfectly with django's default admin interface, too!)
or you might want to use `fieldsets` in your `ModelAdmin`. 

**Perhaps, something like this:**

**`models.py`**

    class Post(models.Model):
        ...
        content = models.TextField()
        ...
	
**`admin.py`**

    class PostAdmin(admin.ModelAdmin):
        fieldsets = (
            ...
            ('Content', {
                'fields' : ('content',)
            }),
            ...
        )

And you're done! Now, however, the `label` for your `texarea` (or name of your `TextField`, which in above case was
`content`) would still be hidden behind TinyMCE, but you would have a nice `legend` (or name of your `fieldsets`) above
it!

### Issue #2

You will also notice that the TinyMCE's toolbars aren't properly aligned (i.e. one would be floating at the center and
the other to the left).
Well, what is happening here is that TinyMCE is overlapping the `label` for `textarea` which, therefore, aquires some
space in the toolbar and the rest of the buttons 
shift to the right. I don't think django admin's stylesheet is doing this because this issue doesn't arise with TinyMCE
3.x. Therefore, I hold version 4.x responsible for this.
There's a fix for that which should be fine, if not much.

### Fix

All you have to do is assign a css `class` to the `label` in your `ModelAdmin`'s `fieldsets` and call that stylesheet
via `class Media`'s `css`. 

**Something like this:**

First up, go ahead and create a folder called `css` inside your `static` directory. Open your text-editor, create a new
css file, name it anything, perhaps, `mystyle.css` 
and save it inside `static\css\` directory. 

**Add the following lines to `mystyle.css`:**

    .myclass label {
        position: absolute;
        /* DO NOT USE postion: fixed;
           It would cause some other issues like the "word count" 
           from the "status bar" of TinyMCE would be displaced to 
           the "site administration" header or somewhere else!
        */
    }

**And here's how your `admin.py` file should look like:**

(I'm continuing the example we saw above in Issue #1)

    class PostAdmin(admin.ModelAdmin):
        fieldsets = (
            ...
            ('Content', {
                'fields' : ('content',),
                # Assign the class below.
                'classes' : ('myclass',)
            }),
            ...
        )
        
        class Media:
            # Call the stylesheet below.
            css = {
                'all' : ('css/mystyle.css',)
            }
            js = ('tinymce/tinymce.min.js', 'js/tinymce_4_config.js')

**And you're done! Now you can imagine how tough things would have been without the mighty `class Media`!**

### Issue #3

If you're using TinyMCE 4.x with `django-admin-bootstrapped`, the above issues don't arise!

However, you run into trouble when you switch to fullscreen editing mode: TinyMCE's `toolbar` is ovrelapped by the
admin's header (or black navbar, call it anything).
This happens because the header (or navbar) is fixed at top, but still I hold TinyMCE 4.x responsible for this as this
issue doesn't arise with TinyMCE 3.x.

### Fix

To fix this,

**either** switch to version 3.x (which, in this case, won't match with the admin interface!)

**or** set the `menubar` option in your configuration file to `true`. By default, it is `true`, but if you're using
`tinymce_4_config.js` file downloaded from here, you will have to do it manually as it is set to `false` there.

So, in `tinymce_4_config.js` find a line called `menubar: false,` (it is the last line in the code) and replace it with 
`menubar: true,`. However, to make the code shorter, you can remove that line, as I said above, by default, it is
`true`. 

Although, this doesn't actually fix our problem since this time the `menubar` is being overlapped by the header. But,
thankfully, all the toolbars are perfectly visible and we have access to all the tools required for editing/formatting
our content!

Another alternative is to edit the `base.html` of `django-admin-bootstrapped` and remove `navbar-fixed-top` from the
header (navbar). Also, you will need to remove the top padding and do a lot other hacks!
Yes, this would be called a hack, unless, of-course, you pull a request to it's owner and submit these changes! 

### Tested with & "not-with"

**Tested with:**
* Django 1.4.5, 1.4.10 and 1.6.1.
* TinyMCE 3.5.8 and 4.0.11.
* Django's default admin interface.
* `django-admin-bootstrapped`.

**Not tested with:** 
* `django-grappelli`.
* And all that is not listed above!

## Not working?

Finally, if this doesn't work for you, it is, perhaps, because your path to your `static` directory is not right. 

You might want to take a look at my `settings.py` configuration for static files (for Django 1.6.1)

    import os
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    ...
    STATIC_URL = '/static/'
        
    STATICFILES_DIRS = (
        os.path.join(BASE_DIR, "static"),
    )
    ...

**However, the above settings work well if you add these lines to your older versions of django.**

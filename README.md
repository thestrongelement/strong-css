# Strong CSS

Bringing the cascade back to CSS. Class-based, component-centric, gets the job done.

## Structure

`vendor`

`base`

`mixins`

`elements`

`blocks`

`layout`

`components`

`views`

`helpers`


--- 


# Modified BEM

While BEM notation is excellent in terms of keeping presentation concerns separated and lends itself well to component architecture, it can lead to repetition. 

True BEM does not encourage descendant relationships in CSS `foo bar {}` focusing instead on class names that define the relationship like `foo__bar {}`. ) However, CSS processors, like SASS, emphasize descendant relationships often leading to complicated nesting structures. The former is good for performance, the latter is bad.

Let's find a middle ground.

## And ...

At the top-level, components should use the BEM notation. Let's take a look at a common `tablist` block/component implementation.

```
<ul class="tablist--purchase" role=tablist>
    <li class="tab__">Foo</li>
    <li class="tab__ locked--">Bar</li>
</ul>
```

### Component-level

The root class here is `.tablist` and uses a BEM-style modifier of `--purchase` to indicate a specific implementation.

```
.tablist, .tablist--purchase {
    list-style: none;
}
```

### Descendants

This is where we introduce a shorthand notation.

#### __ (double underscore suffix)

*This denotes the element in the block.*

Think of this as a local variable — this class should only be styled as a descendant.

```
.tablist {
    & > .tab__ {
        display: inline-block;
    }
}
```
This is the equivalent of `.tablist__tab` in BEM.

You should never see a global style for `.tab__`, ever. If you try to use that class outside of a `.tablist` block it should exhibit default presentation styles.

#### -- (double hyphen suffix)

*This denotes the modifier on a block or an element.*

Think of this as a local variable for state. This should be an additional class, not appended to the block or element class.

```
.tablist {
    & > .tab__ {
        &.locked-- {
            opacity: 0.5; 
        }
    }
}
```

This is the equivalent of `.tablist__tab--locked` in BEM.

As with elements classes, these should never be defined globally. It may be tempting to do this, but use global helpers instead.

Additionally, these should be considered rendered, static classes and not dynamically modified. Use a helper like `.is-locked` or an attribute like `disabled` for what best suits the user interaction.

## Mix it up

True BEM notation is absolutely allowed and is very useful when dealing with more complex content structures. The shortcuts above can still be used.

```
.form {
    .form__set {}
    .form__item, .form__item--highlight {
        .label__ {}
        &.inline-- {}
    }
    .form__actions {}
}
```

This let's us avoid confusing compound BEM class names such as `.form__item--inline-highlight` or using two classes `.form__item--inline` and `.form__item--highlight` on the same element.

Always think of the `__` and `--` notations as local variables so when you see them in the markup you understand they are entirely dependent on a parent component.


## Global helpers

Frameworks like Bootstrap can be great but are essentially helper classes, and represent a different mindset of CSS authoring. They don't always allow a good separation of layout and presentation and can lead to ugly overrides when trying to implement new design requirements that fall outside of the defined Bootstrap patterns.

However, global helpers should be used where they make sense. Often devs use SASS `@extends` in the pursuit of pure semantic markup but as a dev entering a new project these can be confusing and lead to bloated CSS.

Just keep it simple and truly global. 

```
.has-fixed-background {
    background-position: fixed;
}
.is-valid {
    border-color: green;
}
```

These styles can be enhanced at a component level, but should never be overridden.

```
.form__item {
    &.is-valid:before {
        content: "\2713";
    }
}
```

The preference is to use a prefix like `is-` or `has-`. You don't have to use these and should include specific rules in component CSS when it makes sense. These are helpers&#8230;designed to help. 

Additionally, these classes may be dynamically modified with scripts.


## Be smart

Don't attempt do everything in one block. Always think about where one block ends and another should begin. An element can be a component root&#8230;and vice versa.

```
<nav class="menu">
    <ul class="item__ tablist--purchase" role=tablist>
        <li class="tab__">Foo</li>
        <li class="tab__ locked--">Bar</li>
    </ul>
</nav>
```

Yes, the above could be confusing. Is `.tab__` part of `.menu` or `.tablist`? That's where you come in. Design a system that prioritizes small components no more than a few levels deep. Avoid messy nested SASS blocks.

And finally, if a component's structure will be too confusing, then use the more lengthy BEM notation.


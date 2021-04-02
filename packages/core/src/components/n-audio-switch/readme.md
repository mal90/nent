# N-AUDIO-SWITCH

The [\<n-audio-switch\>](/components/n-audio-switch) component exposes a checkbox to enable or disable global audio, for background sounds and video components.


<!-- Auto Generated Below -->


## Usage

### Basic

Display a checkbox for users to set a preference for sound. Disabled mutes all videos and disables all presentational audio.

Using the [\<n-audio-switch\>](/components/n-audio-switch) component description.

```html
<n-audio-switch></n-audio-switch>
```



## Properties

| Property       | Attribute       | Description                                        | Type                   | Default     |
| -------------- | --------------- | -------------------------------------------------- | ---------------------- | ----------- |
| `classes`      | `classes`       | Any classes to add to the input-element directly.  | `string`, `undefined`  | `undefined` |
| `dataProvider` | `data-provider` | The data provider to store the audio state in.     | `string`               | `'storage'` |
| `inputId`      | `input-id`      | The id field to add to the input-element directly. | `string`, `undefined`  | `undefined` |
| `setting`      | `setting`       | Which state property this switch controls.         | `'enabled'`, `'muted'` | `'enabled'` |


----------------------------------------------

NENT 2021 - all rights reserved
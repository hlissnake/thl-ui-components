#DateSelector

DateSelector component is to provide a base for Calendar event entries by date time selection and recurrences configuration.
## Run
`npm run storybook` to see the examples

## Four modes
There are four modes of date time selection:
1. After
    * User only needs to select a start date and time. There is an ending date and time though, it is the end of the date `defaultDuration` (props) or 90 days later by default.
 2. Before
    * User only needs to select an ending date and time. Default start time is now.
3. Range
    * User selects both start date time and ending date time. The range is a time range from the start date time to end date time.
4. Date
    * User picks a single date, a starting time and an ending time within that day. 
    * Recurrences only exist for `Date` mode. There are predefined patterns like 
        * Does Not Repeat
        * Daily
        * Week Days
        * Weekend
        * Weekly
        * Fortnightly
        * Monthly
        * Yearly
        * Custom
    * When `Custom` is selected, User is able to select any days combination in a week.
    * User selects an date (end of the date) for the recurrences as `Util` date.
 
 ## Props
 The props are to rendering the initial values. Only `addCalendar` function is requirec.
 
  | Name          | Prop          | Description  |
  | ------------- |-------------  |-------------  
  |defaultDuration | momentDurationObj | The default duration till the end time if "After" mode is selected. |
  |startDateTime | momentObj | The start date and time of the Calendar event, not required when 'Before' mode is on|
  |endDateTime |momentObj| The end date time of the Calendar event, not required when 'After' mode is on.|
  |dateMode|string| The date mode 'After', 'Before', 'Date', 'Range'|
  |repeatOption|string| How to repeat. Only makes sense when 'Date' mode is selected|
  |repeatUntilDate|momentObj| When the repeat will run until, end of that date |
  |Mon| bool| Repeat on Monday or not, only valid when 'Custom' repeatOption is selected|
  |Tue| bool|Repeat on Tuesday or not, only valid when 'Custom' repeatOption is selected|
  |Wed| bool|Repeat on Wednesday or not, only valid when 'Custom' repeatOption is selected|
  |Thu| bool|Repeat on Thursday or not, only valid when 'Custom' repeatOption is selected|
  |Fri| bool|Repeat on Friday or not, only valid when 'Custom' repeatOption is selected|
  |Sat| bool|Repeat on Saturday or not, only valid when 'Custom' repeatOption is selected|
  |Sun| bool|Repeat on Sunday or not, only valid when 'Custom' repeatOption is selected|
  |addCalendar|func.isRequired| the callback function, the paramter is the output data|
 
## Output
  The callback function 'addCalendar' takes the output data as the paramter. The output is an object which contains the date time selection information.
  
  The four date modes will generate outputs like:
  ```
  {
       startDateTime: "2016-12-12T11:00:00.000Z"
        startEndTime: "2016-12-13T10:59:00.000Z"
        dateMode: "Date"
        repeatOption: "Custom"
        repeatUntil: "2017-01-13T10:59:00.000Z"
        Mon: false
        Tue: true
        Wed: false
        Thu: true
        Fri: false
        Sat: true
        Sun: false
   }
   ```
  
  ```
  {
       startDateTime: "2016-12-08T03:12:00.000Z"
       startEndTime: "2016-12-18T04:12:00.000Z"
       dateMode: "Range"
  }
  ```
  
```
{
     startDateTime: "2016-12-08T03:13:00.000Z"
      startEndTime: "2017-12-08T10:59:00.000Z"
      dateMode: "After"
}
```
    
 ```
  {
       startDateTime: "2016-12-08T03:14:07.779Z"
        startEndTime: "2016-12-18T04:14:00.000Z"
        dateMode: "Before"
  }
  ```
## Styling
The size and the theme can be controlled by configuration in Rebass themes. 
In the storybook tests, you can find example that by changing fontSizes, scales the whole component is scaled up or down.
This is also true for button color.


## TODO
Things worth to consider
1. Airbnb Date picker that we are using is not mobile responsive, and not inline. Might need to find an alternative
2. Currently the theme does not affect the color inside Airbnb date picker, because of Shadow DOM,
which we can not change easily.
3. The style is very basic
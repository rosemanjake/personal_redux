# Caffeine Quitter

Quitting caffeine is difficult. If you consume just one cup of brewed coffee a day and you attempt to quit cold turkey, you will [likely face headache and fatigue](https://jpet.aspetjournals.org/content/255/3/1123.short). This discomfort can be a real problem. It may stop you from abstaining even when the caffeine exacerbates an underlying [anxiety or panic disorder](https://jamanetwork.com/journals/jamapsychiatry/article-abstract/495937). You could also mislead your doctors if you report a splitting headache after undergoing a procedure that is due only to [missing your daily dose of caffeine](https://www.sciencedirect.com/science/article/abs/pii/S0025619612606910).

![An anxiety-ridden coffee drinker failing to abstain](tweek.png)

Clearly, the best way to quit caffeine is to taper off. Doing so minimises withdrawal symptoms and allows you to achieve sobriety without significant difficulty. However, you need to plan and track your taper. It needs to be manageable - not too rapid, nor too slow.

To help you do just that, I have developed an Android app, [Caffeine Quitter](https://play.google.com/store/apps/details?id=com.jaker.caffeinequitter3).

![](caffeinequitter.jpg)

## Features

Caffeine Quitter includes a range of features to help you quit caffeine successfully at your own pace.

### Taper dashboard

You start Caffeine Quitter by telling it how much caffeine you consume and how quickly you would like to quit. The app calculates an ideal taper for you and provides a dashboard in which to track your taper. You can view the number of drinks to consume on the current day, as well as the amount you will consume over each day in the taper. This allows you both to easily manage your intake for the current day, and to track how your taper has and will progress.

![The taper dashboard](images/taperdashboard.webp)

### Statistics

Caffeine Quitter produces a range of statistics to provide you with greater insight into your taper. This is key to providing you with a real sense of progress and achievement as you push through the taper.

![Taper statistics](images/taperstats.webp)

### Cold turkey

While Caffeine Quitter is intended to help you quit gradually, you can also use it to track your progress when quitting cold turkey. It displays how many days you have been caffeine free, as well as the amount of caffeine you have avoided.

![Cold turkey mode](images/coldturkey.webp)

## Development and Frameworks

I developed Caffeine Quitter as a native Android app. As I wished to build an understanding of modern Android development, I chose to use Kotlin rather than Java. Without any prior Android experience, my goal was to complete a functional app within no more than 3 months and host it on the Play Store. I was successful in that aim.

### Front End

I chose to use [Jetpack Compose](https://developer.android.com/jetpack/compose) as my front end framework. Compose is very different from the previous XML-based approach that has predominated in Android development since its inception. Compose is a declarative framework in which developers define the appearance of the app through functions alone. Because I could pass these functions the complex objects produced by my taper algorithm without the need for intermediate adapters, I was able to much more easily display the data.

### Back End

I decided not to include any network connectivity or social features. This ensured that the project was appropriately scoped given that I intended to complete it quickly. Instead, I focused my efforts on developing an effective taper algorithm.

## Taper Algorithm

Caffeine Quitter's taper algorithm takes into account two key data points.

<ul>
<li><strong>Daily caffeine intake</strong>: The amount in miligrams you consume every day. The app calculates this from from the number of coffees, teas, or energy drinks you consume.</li>
<li><strong>Intensity</strong>: This is the relative speed with which the user would like to quit. It ranges from 0-5, where 0 is very gradual and 5 is cold turkey.</li>
</ul>

For intake, there are four benchmark values: 400mg, 250mg, 100mg, and 0mg. The algorithm rounds the user's provided amount to the nearest benchmark value. 

### Taper Gradient

The algorithm takes the user's daily intake and chosen intensity, and matches the user with a gradient that best suits them. There are sixteen possible gradients, each corresponding to a pair of the 4 possible daily intake and intensity values. For each of those pairs, I determined an ideal time over which to quit. I could then very simply attain the gradient of the ideal taper with the equation

<svg class="equation" height="50" width="100">
  <image href="svg/eq_gradient.svg" class="equationimg"/>
</svg>

where `m` is the gradient, `y` the daily miligram and `x` the number of days elapsed. Note that this is indeed a linear decrease. I had experimented with concave and convex patterns that would see the speed of the taper change through time, though a linear taper proved to be the more sustainable pattern.

Displayed in a table, the result of this approach is the below:

<table class="articletable">
<thead><tr><th>Daily MG</th><th>Intensity</th><th>Days</th><th>Gradient</th></tr></thead><tbody>
 <tr style="background-color:var(--pBlue)"><td>400</td><td>0</td><td>84</td><td>0.000525</td></tr>
 <tr style="background-color:var(--pBlue)"><td>250</td><td>0</td><td>56</td><td>0.000896</td></tr>
 <tr style="background-color:var(--pBlue)"><td>100</td><td>0</td><td>28</td><td>0.0028</td></tr>
 <tr style="background-color:var(--pBlue)"><td>0</td><td>0</td><td>0</td><td>0</td></tr>
 <tr style="background-color:var(--pGreen)"><td>400</td><td>1</td><td>56</td><td>0.00035</td></tr>
 <tr style="background-color:var(--pGreen)"><td>250</td><td>1</td><td>28</td><td>0.000448</td></tr>
 <tr style="background-color:var(--pGreen)"><td>100</td><td>1</td><td>14</td><td>0.0014</td></tr>
 <tr style="background-color:var(--pGreen)"><td>0</td><td>1</td><td>0</td><td>0</td></tr>
 <tr style="background-color:var(--pYellow)"><td>400</td><td>2</td><td>28</td><td>0.000175</td></tr>
 <tr style="background-color:var(--pYellow)"><td>250</td><td>2</td><td>14</td><td>0.000224</td></tr>
 <tr style="background-color:var(--pYellow)"><td>100</td><td>2</td><td>7</td><td>0.0007</td></tr>
 <tr style="background-color:var(--pYellow)"><td>0</td><td>2</td><td>0</td><td>0</td></tr>
 <tr style="background-color:var(--pOrange)"><td>400</td><td>3</td><td>14</td><td>0.0000875</td></tr>
 <tr style="background-color:var(--pOrange)"><td>250</td><td>3</td><td>7</td><td>0.000112</td></tr>
 <tr style="background-color:var(--pOrange)"><td>100</td><td>3</td><td>3</td><td>0.0003</td></tr>
 <tr style="background-color:var(--pOrange)"><td>0</td><td>3</td><td>0</td><td>0</td></tr>
 <tr style="background-color:var(--pRed)"><td>400</td><td>4</td><td>7</td><td>0.00004375</td></tr>
 <tr style="background-color:var(--pRed)"><td>250</td><td>4</td><td>3</td><td>0.000048</td></tr>
 <tr style="background-color:var(--pRed)"><td>100</td><td>4</td><td>1</td><td>0.0001</td></tr>
 <tr style="background-color:var(--pRed)"><td>0</td><td>4</td><td>0</td><td>0</td></tr>
</tbody></table>

#### Implementation

The `calcGradient()` function calculates the benchmark gradient that matches the user's input. The function holds a series of `Map` variables that contain all the information in the table above. The keys of each `Map` are the benchmark daily miligram values and the values are the corresponding gradients. There is a map for each intensity level.

The app then fetch the gradient with the following code:

```
var gradient = 0.0;

when(intensity){
    0.0 -> gradient = vlowmap[dailymg] as Double
    1.0 -> gradient = lowmap[dailymg] as Double
    2.0 -> gradient = medmap[dailymg] as Double
    3.0 -> gradient = highmap[dailymg] as Double
    4.0 -> gradient = vhighmap[dailymg] as Double
}

return gradient;
```

A gradient of `0.0` indicates that the user is quitting cold turkey.

### Number of days

While the gradient is calculated with a benchmark miligram value, the number of days over which the taper takes place derives from the actual daily miligram amount provided by the user. Using linear algebra, it is easy to calculate where a taper will reach its end. I used the formula 

<svg class="equation" height="50" width="100">
  <image href="svg/eq_numdays.svg" class="equationimg"/>
</svg>

where `y` is total number of days over which the taper takes place, `m` is the gradient, and `x` is the initial daily miligram value.

#### Implementation

In Kotlin, the `calcDays()` function performs this calculation. If it produces a value less than 2, it sets the day value to 0, which will be cold turkey. If it calculates more than 90 days, it rounds the value to 90. This is because a taper less than 2 days is of course not a taper and because 90 should be enough for anyone to quit caffeine.

The function appears as follows:

```
fun calcDays(gradient: Double, total: Double): Int{
    var days = gradient * (total.pow(2)) //Our algebra. Using a linear equation.
    if (days < 2.0){
        days = 0.0;
    }
    else if (days > 90.0){
        days = 90.0;
    }

    // Add an extra day so there can be a day card with 0
    return days.toInt() + 1;
}
```

### Daily miligrams

With all the above values in hand, it is then possible to calculate the amount in miligrams that the user should consume every day. Following the simple linear algebra above, I used the following formula

<svg class="equation" height="50" width="100">
  <image href="svg/eq_dailymg.svg" class="equationimg"/>
</svg>

where `y` is the miligram amount per day, `m` is the gradient, `x` is the days elapsed and `c` is the initial daily miligram value. 

#### Implementation

The `calcMgPerDay()` function returns the daily miligram amounts. The algorithm loops over each day in the taper and uses the formula below to calculate the day's corresponding miligram amount.

```
fun calcMgPerDay(days: Int, startingmg: Double): List<Double>{
  //Create empty hash map we will return later
  var perdaymg = mutableListOf<Double>();

  //Get gradient of the linear decrease
  var gradient = (-1 * startingmg) / days;

  //Get mg value for each day, following the linear decrease
  for (currday in 1..days){
      var dayselapsed = currday.toDouble();
      perdaymg.add(gradient * dayselapsed + startingmg);
  }

  return perdaymg;
}
```

Note that here the app measures the gradient again. This is because here it needs the gradient of the line plotting the number of days trending to 0. The exact gradient of line will be different from the benchmark gradient used to calculate the number of days.

### Daily drinks

With the daily intake value in miligrams, it is necessary to translate it back into a certain number of drinks. The user may choose to include any set of drinks in their taper. This will enable, for example, a coffee drinker to switch to a mix of black and green tea during the taper. 

The alogirthm splits the daily miligram amount evenly between the drinks in the taper and then determines how many servings of each drink the user should consume on each day. It rounds to the nearest half drink to ensure a smooth decrease. Whether it rounds up or down depends on where in the taper the user is. It will round up early on to prevent the taper from being too stark, while later in the taper it will round down. This can introduce some mild convexity to long tapers.

### Result

The result of this taper algorithm is the number of drinks the user should consume each day, trending towards zero. The amount corresponds to their initial intake and the speed with which they would like to quit. In each case, it produces a manageable taper that greatly aids the user in kicking their habit.


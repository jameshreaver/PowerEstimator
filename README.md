# PowerEstimator
Estimating the power consumption of a lightbulb on an unreliable network.

---
## The problem

You’ve been tasked by humanity to stop global warming and, as a diligent engineer, you know you need to measure things you want to change. Hence, you’re starting your earth-saving challenge by writing a tool that can estimate the power draw of a single dimmable smart light
bulb.

When fully lit, the light consumes 5W, and this then drops linearly as the dimmer is turned down. Internally, the light represents its dimmer value as a floating point number between 0.0 and 1.0, inclusive. The light outputs a message whenever someone adjusts it. Each message contains a timestamp from the light bulb’s internal clock (in seconds since the start of 1970).

There are two types of message. A ​`TurnOff`​ message indicates that the light has been turned off completely. A `​Delta`​ message indicates that the brightness has been adjusted; it includes a value for the change in the dimmer value (a floating point number between -1.0 and +1.0 inclusive).
Your tool consumes these messages, estimates the dimmer value over time, and uses that to estimate the energy consumed by the light.

But there is a catch. The protocol used to transmit the messages is unreliable. Your tool should
deal with the messages being duplicated, lost and/or delivered out of order.

---

## The solution

The solution is a JavaScript program which reads a series of such messages from standard input and outputs the estimated power consumption.

#### Assumptions
Here are the assumptions made by the solution:

* __Duplicate timestamps__. Two messages with the same timestamps are considered to be duplicates. Even if they had different delta values, the processing of the two would imply that the settings of the first ones would be immediately overwritten by the settings of the second one. For this reason, messages replace previous messages with the same timestamps. _Max one message per timestamp._

* __Correctly formatted input__. It is assumed that the input is correctly formatted according to the specs. Handling of badly-formatted input is beyond the scope of this implementation but would need to be taken into account in production systems.

* __Encapsulation__. The classes provided do not hide internal methods and fields via encapsulation. Again, this was not the focus of the implementation for this exercise.

#### Problems
Here are the problems given by the underlying unreliable network assumption:

* __Duplicate messages__. Duplicate messages are handled by keeping the most recent message received for a timestamp. See assumption section for more.

* __Out of order messages__. Out of order messages are handled using a data store which efficiently stores and retrieves messages by their timestamps. Retrieved messages can be processed safely.

* __Lost messages__. This solution can only do so much about lost messages. A smart light could issue multiple duplicate messages to cater for this, given that our solution is able to handle those correctly. Alternatively a more advanced acknowledgement system could be put in place over the network used.

---

## Implementation

The solution provides the following six classes:

__Lamp__. The Lamp class is a model that represents and tracks the current brightness settings in response to incoming messages. It is an internal class of `PowerEstimator` and exposes the method `adjust()`. This methods _guarantees_ that the brightness value stays between 0.0 and 1.0.

__Message__. A simple class to represent a brightness adjustment message, for given `timestamp` and `delta` values. `TurnOff` messages are created with a delta value of -1. This ensures that the lamp is turned off regardless of its brightness, which can never have a value lower than zero.

__MessageParser__. A class to which exposes the method `parse()`. This method takes a line formatted according to the specs and returns its `Message` object representation. Once again, a `TurnOff` message is a message with delta value of -1.0, so that all messages are of the same type.

__MessageStore__. A class responsible for storing incoming messages and ensuring they are kept in the order of their timestamps. `MessageStore` also handles duplicate messages, storing the latest one for a given timestamp. Internally, it relies on a sorted B+ tree for easy ordering and accessing of messages. It exposes the method `add()` message, and a series of wrapper methods including `get()` which guarantees to return the stored messages _in chronological order_.

__PowerEstimator__. This core class of the implementation estimates the power consumption based on the given power-per-hour parameter. It exposes the method `process()` which, for an array of _ordered_ messages, updates the `estimate` value. `process()` can be called multiple times as messages come in. Internally this class holds a `Lamp` object to track the current brightness settings and it records the timestamp of the last message that was processed.

For each message, the `estimate` parameter is incremented by the product of the current brightness level, the estimator's power-per-hour setting and the amount of hours the lamp has been kept at that brightness level (current timestamp minus the previous timestamp). After the update, the lamp is set to the new brightness value.

__Program__. This class strings everything together and creates a simulation for a given power-per-hour setting and other optimisation settings. It exposes the method `feed()` which sends an input line into the program and the methods `compute()` and `print()` which calculate and output the estimate respectively.

---

## Optimisations

> Available on branch `optimisations`

After solving the problem, I thought about two potential optimisations to the solution. Both are aimed at reducing the amount of resources taken by the program. One is space-based and the other is time-based, and they can be used in conjunction with each other.

__Space-based optimisation__

This optimisation ensures that the space used by the program to store incoming messages is bound. This is defined by a `maxSize` variable supplied to `MessageStore`. With this optimisation, when the store reaches the maximum size, the oldest message stored is retrieved, removed, and used to update the current estimate.

Originally it removed a whole batch of old messages. However the option of one-in one-out is just as efficient and allows more time for potentially delayed messages to find their correct place in the message store.

__Time-based optimisation__

This optimisation aims at saving program resources on the assumptions that messages will not get delayed past a set amount of time. This amount is defined by a `maxHours` variable supplied to `MessageStore`. With this optimisation, a pruning operation runs with each message, retrieving and removing all messages generated over `maxHours` hours before the last seen message. The current estimate is then updated with the messages removed.

__Combining optimisations__

In the branch `optimisations`, the two improvements run together. If optimisation is enabled and the message store is full, we try to remove messages by the time-based method, which we deem safer. If no messages are removed this way, we consume the oldest message to free up some space.

---
### Running the tool

First of all install the two dependencies by running:

```
npm install
```

One dependency, namely `readline`, is used but not listed because it's become part of the most recent core Node modules and shouldn't require installation. At this point you can run the tool with:
```
npm start
```
You can write to standard input or feed it an input file. If you require the clean output, run `node index.js` directly. __Space or time based optimisations may lead to less accurate power consumption estimates.__

### Running tests

Mocha tests can be run with the command:
```
npm test
```

---
> Developed by James Reaver in February 2020.

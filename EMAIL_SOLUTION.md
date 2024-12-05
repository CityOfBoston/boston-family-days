# Email Delivery Solutions: Research and Comparison

Required:
1. I need to be able to register a user as a subscriber. I also need to be able to create and manage user groups, and add subscribers to user groups. There should be data stored alongside users and user groups: email address, pass id, first and last name, preferred language.
2. I need to be able to send out emails to groups of users at the same time. I should be able to customize the email based on properties of each user. For example. If I would like to attach their name and id within the email I should be able to do it for the batch without writing every email word by word.
3. I need to be able to update subscriber information within firestore based on the real time subscribe and unsubscribe events of users. This should be done via webhooks. An http trigger cloud function will be created in firebase and the email service should send a request to this endpoint once a subscriber event is performed.
4. I need to be able to handle unsubscribing within the email service. Ideally there should be a generic link in each email to unsubscribe within the email service. There should be a UI screen that confirms unsubscribing.

Optional:
1. I should be able to manually trigger unsubscribing of users. I may do so from firebase cloud functions if data analytics decides certain users are fraudulent.
2. I should be able to receive insights on specific user email events, such as the time of opening an email, number of bounces, etc. Ideally this should be done real time via web hooks so I could store the information within firestore. Data analytics would like this data as a measurement of engagement.
3. I should be able to change mailing lists, email templates and the logic of customizing emails after they have been created. This will ensure the flexibility of the tool and service.

## Upaknee

| **Feature**                              | **Supported** | **Endpoint(s)**                                       | **Customization**                                    |
|------------------------------------------|---------------|------------------------------------------------------|-----------------------------------------------------|
| **Required**                             |               |                                                      |                                                     |
| Register Subscribers                     | Yes           | `POST /subscribers`, `POST /lists/{list_id}/subscribers` | Custom fields via XML payload.                     |
| Manage User Groups                       | Yes           | `POST /lists`, `POST /lists/{list_id}/subscribers`   | Can manage groups as lists.                        |
| Send Customized Batch Emails             | Yes           | `POST /triggers/:trigger-name/mailings`             | Supports merge tags for dynamic content.           |
| Real-Time Subscriber Updates             | Yes           | `POST /webhooks`, `GET /webhooks`                   | Can set aliases, headers, and event types.         |
| Generic Unsubscribe Link                 | Yes           | `DEL /unsubscribe`                                  | Endpoint only; no built-in UI.                     |
| **Optional**                             |               |                                                      |                                                     |
| Manual Unsubscribing                     | Yes           | `DEL /unsubscribe`                                  | Can programmatically unsubscribe users.            |
| Real-Time Email Insights (Opens, Bounces)| Partial       | No endpoints and not part of event status but representative is working on providing details, also saved in upaknee regardless       | Check with Upaknee for possible webhook support.   |
| Modify Mailing Lists                     | Yes           | `PUT /lists/{list_id}`                              | Supports updates to list attributes.               |
| Modify Email Templates                   | Partial       | Not detailed in the API documentation, Support via console confirmed, can also be done via creating a new list    | May depend on internal Upaknee template tools.     |

## Twilio

| **Feature**                              | **Supported** | **Endpoint(s)**                                         | **Customization**                                    |
|------------------------------------------|---------------|--------------------------------------------------------|-----------------------------------------------------|
| **Required**                             |               |                                                        |                                                     |
| Register Subscribers                     | Yes (via Subusers) | `POST /subusers`                                       | Add subusers with email, username, password, and IPs. |
| Manage User Groups                       | Yes (via Subusers)            | `POST /marketing/lists`                              | Can be done in batches            |
| Send Customized Batch Emails             | Yes           | `POST /mail/send`                                      | Supports dynamic template data for personalization. |
| Real-Time Subscriber Updates             | Yes           | `POST /user/webhooks/event/settings`                | Can also set up an Event Webhook in the console.    |
| Generic Unsubscribe Link                 | Yes           | `POST /mail/send`                                      | Add unsubscribe link using `asm` parameter.         |
| **Optional**                             |               |                                                        |                                                     |
| Manual Unsubscribing                     | Yes           | `DEL marketing/lists/{id}/contacts`            | Can remove contacts from a given list.            |
| Real-Time Email Insights (Opens, Bounces)| Yes           | `PATCH /user/webhooks/event/settings`    `PATCH /tracking_settings/subscription  `          | Supports webhook configuration for engagement events.|
| Modify Mailing Lists                     | Yes            | `PATCH /marketing/lists/{id}`   | Managed within Marketing Campaigns                         |
| Modify Email Templates                   | Yes           | `PATCH /templates/{template_id}`                      | Update templates directly via the API.              |
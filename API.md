# TMI People API


* [Agreements](#agreements)
  * [Agreement schema](#agreement-schema) TODOC
  * [List Agreements](#list-agreement) TODOC
  * [Find Agreements](#find-agreement) TODOC
  * [Create Agreement(s)](#create-agreement) TODOC
  * [Update Agreement(s)](#update-agreement) TODOC
  * [Delete Agreement(s)](#delete-agreement) TODOC
* [Agreement types](#agreement-types)
  * [Agreement type schema](#agreement-type-schema)
  * [List Agreement types](#list-agreement-types)
  * [Find Agreement types](#find-agreement-types)
  * [Create Agreement type(s)](#create-agreement-types)
  * [Update Agreement type(s)](#update-agreement-types)
  * [Delete Agreement type(s)](#delete-agreement-types) TODOC


## Agreements

>Agreements are forged between users; collectives; and users and collectives.
These agreements represent relationships between participants and include:
>
>* friendship between users
>* invitations to, and member- and moderatorship between users and collectives
>* registration of projects between collectives.
>* any other kind of agreement our community may wish to create.


### Agreement schema

TODOC


### List Agreements

TODOC


### Find Agreements

TODOC


### Create Agreement(s)

TODOC


### Update Agreement(s)

TODOC


### Delete Agreement(s)

TODOC


### Agreement types

```
http://127.0.0.1:3000/agreement
```

>The root endpoint of agreements allows management of *types of agreement*.

<br />
<hr />

### Agreement type schema

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `GET`
Content-Type| `application/json;schema`

<br /><details><summary>Expected response</summary>

```JSON
{
    "code": 200,
    "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://tmi.mobi/agreement/agreement.schema.json",
        "definitions": {
            "uei": {
                "$ref": "http://tmi.mobi/root.schema.json#/definitions/uei"
            },
            "participantRef": {
                "$ref": "http://tmi.mobi/root.schema.json#/definitions/participantRef"
            }
        },
        "type": "object",
        "title": "string",
        "name": "string",
        "properties": {
            "id": {
                "$ref": "#/definitions/uei"
            },
            "owner": {
                "$ref": "#/definitions/participantRef"
            },
            "schema": {
                "type": "object"
            }
        },
        "required": [
            "name",
            "owner",
            "schema"
        ]
    }
}
```

Where ```schema:``` is the
[JSON schema](endpoints/agreement/agreement.schema.json) that
defines agreement types.

</details><br />

---

### List agreement types

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `GET`
Content-Type| `application/json`

<br /><details><summary>Expected response</summary>

```JSON
{
    "status": "Success",
    "code": 200,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "administrator",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/agreement/administrator/administrator.schema.json",
                "type": "object",
                "title": "Administrator Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 0
        },
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "moderator",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/default/moderator.json",
                "type": "object",
                "title": "Moderator Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 1
        },
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "member",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/agreement/default/member.agreement.schema.json",
                "type": "object",
                "title": "Membership Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 2
        },
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "guest",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/default/guest.json",
                "type": "object",
                "title": "Guest Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 3
        }
    ]
}
```

</details><br />

---
### Find agreement types

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement?property=value&anotherProperty=etc`
Request type| `GET`
Content-Type| `application/json`

Where "property" and "anotherProperty" represent properties of the schema type,
eg.

`http://127.0.0.1:3000/agreement?name=guest`

<br /><details><summary>Expected response</summary>

```JSON
{
    "status": "Success",
    "code": 200,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "guest",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/default/guest.json",
                "type": "object",
                "title": "Guest Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ]
            },
            "id": 3
        }
    ]
}
```

</details><br />

---


### Create agreement type(s)

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `POST`
Content-Type| `application/json`

<details><summary>Request body</summary>

```JSON
[
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "test-agreement",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/test-agreement",
                "type": "object",
                "title": "Test Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ],
                "properties": {
                    "newProp": {
                        "type": "string"
                    }
                }
            },
            "id": 4
        }
    ]
```

</details><br />

<details><summary>Expected response</summary>

```JSON
{
    "status": "Entities created",
    "code": 201,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "test-agreement",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/test-agreement",
                "type": "object",
                "title": "Test Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ],
                "properties": {
                    "newProp": {
                        "type": "string"
                    }
                }
            },
            "id": 4
        }
    ]
}
```

</details><br />

Creates a new agreement type and enpoint, in this case:
```
/agreement/test-agreement
```
that may now be used to create instances of the agreement type "test-agreement",
as per the provided name and schema.

<br />

---

### Update agreement type(s)

|||
--- | ---
Authentication| **`Required`**
Endpoint|`http://127.0.0.1:3000/agreement`
Request type| `PUT`
Content-Type| `application/json`

<details><summary>Request body</summary>

```JSON
[
	{
		"owner": {"entityType": "collective", "id": 0},
		"name": "test-agreement",
		"schema": {
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": "http://tmi.mobi/schemas/agreement/default/guest.json",

			"type": "object",
			"title": "Test Agreement",

			"allOf": [
				{"$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"}
			],
			"properties": {
				"newProp": "boolean"
			}
		}
	}
]
```
</details>

</details><br />
<details><summary>Expected response</summary>

```JSON
{
    "status": "Success",
    "code": 200,
    "expose": true,
    "entities": [
        {
            "owner": {
                "entityType": "collective",
                "id": 0
            },
            "name": "test-agreement",
            "schema": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "http://tmi.mobi/schemas/agreement/test-agreement",
                "type": "object",
                "title": "Test Agreement",
                "allOf": [
                    {
                        "$ref": "http://tmi.mobi/agreement/base.agreement.schema.json"
                    }
                ],
                "properties": {
                    "newProp": {
                        "type": "boolean"
                    }
                }
            },
            "id": 4
        }
    ]
}
```

</details><br /><hr />


### Delete agreement type(s)

TODO
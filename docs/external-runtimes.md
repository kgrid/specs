# Kgrid Remote Runtime Spec

##Overall Purpose
This spec outlines the development of remote runtimes
that communicate with the KGrid Activator via the Proxy Adapter's API.

##Runtime Lifecycle
1. ####Load Cache (Optional)
    Optionally, a runtime can choose to try to activate Knowledge Objects
    that have previously been loaded onto its internal persistence layer.
    This should not depend on having an Activator present.

2. ####Registration
    When first starting up, a remote runtime should call the registration
endpoint on the Proxy Adapter like so:
    
    Endpoint:
    `POST` to `{ActivatorUrl}/proxy/environments`

    Headers:
    ```Content-Type: application/json```

    Request Body:
    ```json
    {
        "url":"{remoteRuntimeUrl}",
        "engine":"{Engine (node, python, java, etc)}"
    }
    ```

    This will register the runtime with the Proxy Adapter, so it has a handle
    on the location of the runtime and which engine the runtime handles.
    
    Response Body:
    ```json
    {
        "registered":"success"
    }
    ```
3. ####Activation
    After the runtime receives the successful response from registration,
    it should then tell the Proxy Adapter to activate the Knowledge Objects
    it knows about that use that runtime's engine.
    
    Endpoint:
    `GET` to `{ActivatorUrl}/activate/{engine}`

    Headers:
    ```Content-Type: application/json```
    
    Path Variable: `engine`
    
    This will cause the activator to try to activate all KO endpoints
    that specify the given engine in their deployment specification.
    Response Body:
    ```json
        [
             {
                "path": "/naan/name/apiVersion/endpointName",
                "activated": "2020-11-11T15:57:10.499402",
                "status": "Activated"
             }
        ]
    ```
   
   As part of this work, the Proxy Adapter will then `POST` to the
   runtime's `endpoints` endpoint for each endpoint it has for that
   engine like so:
   
   Endpoint:
   `POST` to `{RuntimeUrl}/endpoints`
   
   Headers:
   ```Content-Type: application/json```
   
   Request Body:
   ```json
       {
           "baseUrl":"{activatorUrl}/proxy/naan/name/version/",
           "uri": "naan/name/apiVersion/endpointName",
           "artifact":[
             "src/payloadFile1.js",
             "src/payloadFile2.js"
           ],
           "engine":"node",
           "entry":"src/payloadFile1.js",
           "function":"mainMethod",
           "checksum":"f8eaf89af8ar5gg5er8s9g8b9"
       }
   ```
   where:
   - `baseUrl` is the URL of the KO containing the endpoint being activated
   - `uri` is the URI of the endpoint in the activator
   - `artifact` is a list of all the payload files needed for the activated endpoint
   - `engine` is the engine the endpoint uses
   - `entry` is the path to the payload file containing the main method
   - `function` is the name of the main method
   - `checksum` is a checksum created when packaging the KO
   
    Response Body from runtime:
    ```json
    {
         "id":"naan/name/apiVersion/endpointName",
         "uri":"{internal runtime uri}",
         "activated":"2020-11-11T15:57:10.499402",
         "status":"Activated"
    }
    ```
   
   Optionally, (if a runtime has a persistence layer on which it stores activated
   endpoints) runtimes can choose whether or not to download the binaries
   for an endpoint by comparing the checksum from the last time that endpoint
   was activated. It should just respond as if it downloaded and activated
   the endpoint as normal in this case.
   
   #####Managing Dependencies for KOs
   Many languages and frameworks, like node and python, 
   rely on published packages to do some work without reinventing the wheel.
   For example, node uses package.json to declare which dependencies
   the code will need. In Python, a developer may include a requirements.txt
   file or call it out in their setup.py.
   
   A runtime must have a way of finding and including these dependencies, unless
   the runtime is designed to only handle bundled Knowledge Objects.

##Execution Lifecycle
Now that the runtime has got some endpoints loaded, it must make them
available at the endpoints at which it told the activator they would 
be able to be called in the following format:
`{runtimeUrl}/{endpointUri}`

For example: 

`http://localhost:1234/naan_name_apiVersion_endpointName`

or

`https://my-remote-runtime.herokuapp.com/234985437523`

Endpoint:
`POST` to `{RuntimeUrl}/{endpointUri}`

Headers:
```
Whatever headers the KO endpoint requires
```

Request Body:
```
Whatever inputs the KO endpoint is looking for
```
Response Body:
```
Whatever response the KO endpoint wants to return
```

Keep in mind, the endpointUri that the runtime gives to the activator is
entirely up to the runtime, and does not need to be in any specific 
format.

###Simple KO
The most basic Knowledge Objects will just contain one code file, take
some inputs, and return an output. Nothing special from what is described above.

###Executive KO
In some cases, a KO developer will want one KO endpoint to call other
loaded Knowledge Objects. We refer to these as Executive KOs. In this
case, the runtime will have to have loaded the child KO being called
into some kind of context accessible by the executive KO.

##Necessary Endpoints
###POST /endpoints
This endpoint is for the loading of endpoints into the runtime.

   Endpoint:
   `POST` to `{RuntimeUrl}/endpoints`
      
   Headers:
   ```Content-Type: application/json```
      
   Request Body:
   ```json
   {
     "baseUrl":"{activatorUrl}/proxy/naan/name/version/",
     "uri": "naan/name/apiVersion/endpointName",
     "artifact":[
       "src/payloadFile1.js",
       "src/payloadFile2.js"
     ],
     "engine":"node",
     "entry":"src/payloadFile1.js",
     "function":"mainMethod",
     "checksum":"f8eaf89af8ar5gg5er8s9g8b9"
   }
   ```
   where:
   - `baseUrl` is the URL of the KO containing the endpoint being activated
   - `uri` is the URI of the endpoint in the activator
   - `artifact` is a list of all the payload files needed for the activated endpoint
   - `engine` is the engine the endpoint uses
   - `entry` is the path to the payload file containing the main method
   - `function` is the name of the main method
   - `checksum` is a checksum created when packaging the KO
      
   Response Body from runtime:
   ```json
   {
    "id":"naan/name/apiVersion/endpointName",
    "uri":"{internal runtime uri}",
    "activated":"2020-11-11T15:57:10.499402",
    "status":"Activated"
   }
   ``` 
    
###GET  /endpoints
Returns a list of all the endpoints the runtime knows about.

   Endpoint:
   `GET` to `{RuntimeUrl}/endpoints`
      
   Headers:
   ```Content-Type: application/json```

   Response Body from runtime:
   ```json
   [
      {
          "url": "{runtimeUrl}/{endpointUri}",
          "id": "naan/name/apiVersion/endpointUri",
          "activated": "Wed Nov 11 2020 17:01:17 GMT-0500 (Eastern Standard Time)",
          "status": "Activated"
        }
   ]
   ``` 
    
###GET  /info
Returns an object containing information about this runtime.

   Endpoint:
   `GET` to `{RuntimeUrl}/info`
      
   Headers:
   ```Content-Type: application/json```

   Response Body from runtime:

   ```json
   {
    "app": "My runtime name",
    "version": "0.3.1",
    "engine": "node",
    "status": "up",
    "url": "{runtimeUrl}",
    "activatorUrl": "{activatorUrl}"
    }
   ```

###GET  /register
Triggers registration with the Activator.

   Endpoint:
   `GET` to `{RuntimeUrl}/register`

##Error Handling
	Registration
	Activation
		Malformed KO
		Syntax Error
	Execution
		Syntax Error
		Bad Mimetype
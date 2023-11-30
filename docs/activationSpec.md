# Knowledge grid Activator Specifications

__Version 0.1.0__

## 1. Introduction
A knowledge grid activator implements our metamodel for computational knowledge artifact “activation” that empowers users to execute computational biomedical knowledge objects (CBK). This specification defines a standard, language-agnostic set of rules that could be used to implement a knowledge grid compliant activator. 

## 2. Purpose
Our goal is to design and build a meta model that helps move biomedical knowledge into practice more quickly, more broadly and more accurately than ever before. Our activator model will make it as simple as possible to implement computational biomedical knowledge objects (CBKs), share them with the world and use others. This requires infrastructural standards and specifications that enable integration at scale. By offering a unified platform for CBK activation and integration, the activator aims to achieve several key goals:

> 1. __Ease of Use__: The activator abstracts the complexities of CBK activation, making it easy for users to harness the power of CBKs without delving into technical details or programming intricacies.
> 2. __Efficiency__: Users can quickly activate and utilize CBKs through standardized API calls, streamlining the process of obtaining valuable insights or performing specific computations.
>3. __Cross-Language Compatibility__: The activator's design allows for extensibility, enabling the activation and use of CBKs written in a different programming language, in an application that consumes them. This cross-language compatibility fosters collaboration and knowledge sharing among diverse developer communities.
> 4. __Access to CBKs__: Users can access specialized CBKs, developed by domain experts, even if they lack the expertise to create these objects themselves. 
> 5. __Documentation__: The activator offers detailed documentation and metadata, making it easier for users to understand what CBKs are, where they came from and how to interact with them. 
> 6. __Versioning and Updates__: The activator supports versioning, allowing developers to release updates or improvements to CBKs while ensuring backward compatibility for existing users.
> 7. __Building Trust__: By providing a cohesive platform for the activation of CBKs, the activator establishes a foundation of trust for users seeking to leverage CBKs.
> 8. __Reusability__: The activator promotes reusability, allowing users to efficiently employ computational knowledge objects across different platforms.

## 3. Status of this document
This document is a __draft__ of a potential specification. It has no official standing of any kind and does not represent the support or consensus.

## 4. Definitions

### 4.1 Knowledge Object (KO)
A collection of metadata and binary files that together have a unique identifier (including version identifier). There are four required file types: a service description, a deployment description, a file that contains metadata and one or more payload files implementing the service described by the service description, deployable using the information in the deployment description. The metadata of a KO, when loaded in an activator, could be exposed using a get request to {server path}/kos/{ko id}.  See [Kgrid Knowledge Objects](https://github.com/kgrid/koio/kgrid_knowledge_objects.md) for more detail.

### 4.2 KO Endpoint
A service path exposed by a particular knowledge object. Takes the form {server path}/endpoints/{ko id}/{endpoint id}. If a get request is sent to an endpoint it will reveal deployment info of that endpoint. If a post request with a body is sent to the endpoint it will pass it to and execute the corresponding function of that endpoint and return the result of the function as response.

### 4.3 KO id
It is a unique globally identifier for a single ko. The Knowledge Grid currently uses [ARK](https://n2t.net/e/ark_ids.html) identifiers natively which interoperate with [EZID](http://ezid.cdlib.org/) and top-level resolvers like [Name2Thing](http://www.n2t.net/) and [Identifiers.org](http://www.identifiers.org/). (Support for other identifiers like [DOI](http://www.doi.org/)s is planned)

### 4.4 Endpoint Id
It is a unique identifier for a single function within the ko identified by the ko id. The globally identifier for endpoint is the combination of ko id and endpoint id.

### 4.5 Activation
The process of deploying an implementation of a KO into an activator in order to make the service endpoints. This includes loading and installing the KO package, extracting the service function based on deployment data and exposing the function through api calls.

### 4.6 Manifest
A representation of a collection of KOs. The minimal representation is an array of KO metadata JSON-LD objects with an @id property and location. Activator implementations may choose to use a local manifest. It may be created in the cache and it can include loading details other than the original manifest information.This local manifest could be used as a way to pass the state of the loaded KOs from loading step to installation step. This will be helpful specially if these steps are made available independent of each other using CLI commands.

### 4.7 Metadata
Metadata is commonly described as “data about data”, but for our purposes can perhaps be better understood as machine-readable documentation of the administrative, descriptive and technical properties of the KOs. Metadata refers to information that describes and represents KOs and provides context for it. See [Metadata section of Kgrid Knowledge Objects](https://github.com/kgrid/koio/kgrid_knowledge_objects.md#kgrid2metadata) for more detail.

### 4.8 Loading KOs
Loading refers to the process of retrieving, validating and initializing knowledge objects that are listed on the input manifest. This process may include preparing a local copy of the knowledge objects listed on the manifest.

### 4.9 KOs installation
It refers to the process of configuring and setting KOs up to work within your system. While loading focuses on getting the knowledge object into your environment, installation goes a step further. It involves tasks such as configuring any necessary settings, resolving dependencies, and making the knowledge object fully functional within your system's ecosystem.

## 5. Specifications
### 5.1 Caching
The activator MAY cache KOs and keep them locally. If the KOs are cached then the activator SHOULD report the local url.

### 5.2 Manifest path
The activator MUST load KOs from a manifest file that has the specific format mentioned in specs. 

The activator MUST allow the manifest path to be defined at runtime (typically through an environment variable). The manifest path MUST be a valid URI. Implementations MAY additionally allow local file path references, including relative path. Additional tooling MAY allow manifest paths to be set in other ways (e.g. by command line properties ).

The activator SHOULD resolve the manifest item’s, if their location is not absolute, using the manifest path.

If the manifest path is used as an environment variable, to avoid conflicts with other activators and apps, the activator SHOULD use its id as part of the environment variable names. Example: ORG_KGRID_PYTHON_ACTIVATOR_MANIFEST_PATH. Activator developers SHOULD document  what they are using for the name of the environment variable. If no environment variable is set, the system MAY load objects from a well known location.

### 5.3 Activation
#### 5.3.1 Loading
The activator MUST use a provided manifest to effectively load new KOs. It MUST have the capability to interpret the manifest, which SHOULD contain information about KO IDs and their respective locations. 

When loading KOs from a manifest, the activator MAY create a local copy of KOs (a cache) or MAY access, validate and use them from a remote resource. If KOs are compressed the activator MAY decompress them.

The activator SHOULD keep track of the loading status and errors and report them as part of the activation status. If the activator fails to load some or all of the KOs, it still SHOULD report the status and error for all KOs listed in the manifest. Activator implementations MAY choose to use a local manifest to store this information to be used in the next steps of the activation and in reporting. This local manifest MAY be created in the cache and MAY include the following information for each KO:

> 1. KO metadata (at least the @id from input manifest, if KO could not be loaded)
> 2. Activation status for each KO
> 3. Loading error, if any, for each KO
> 4. Original_url from the input manifest
> 5. Local_url in the cache

The activation status for each KO MUST be kept in a field called status and it SHOULD have one of the following values:

> 1. "uninitialized"
> 2. "loaded"
> 3. "installed"
> 4. "activate"

#### 5.3.2 Installation
The activator MUST use the local manifest to install the KOs that are successfully loaded and are ready to install.

The activator MUST install KOs and provide access to their functions based on the deployment data. 

The activator MIGHT support installation of KOs that are implemented using different versions of kgrid (for more detail on different kgrid versions please refere to [Kgrid Knowledge Objects](https://github.com/kgrid/koio/kgrid_knowledge_objects.md) on our koio ontology repository). The activator MUST specify in its documentation that which kgrid versions it supports.

When activating kgrid 1 KOs, the activator MUST consider the engine of each KO, listed in their deployment file, to only install the ones that are compatible with the activator. For kgrid 2 KOs the activator MUST look at the engine of each service, listed in metadata, to only install the KO services that are compatible with the activator.   

The activator SHOULD use the engine specific detail from the deployment file to perform KO installation.

The activator MUST use a routing mechanism to be able to direct requests for each endpoint to the corresponding function. Each KO MAY have multiple routes (endpoints).

The activator SHOULD keep track of the KO status and error from loading to installation. It SHOULD update KO’s activation status and error with the status and errors of the installation.

#### 5.3.3 Resource APIs

##### Root

Request:

```json
GET / HTTP/1.1 
Accept: application/json
```

Activator MUST redirect GET requests to the root {serverpath}/ to open api documentation at {serverpath}/docs. 

##### Open api documentations

Request:

```json
GET /docs HTTP/1.1 
Accept: application/jso
```

Activator MUST provide open api documentation on GET requests at {serverpath}/docs.

##### KOs
Request:

```json
GET /kos HTTP/1.1 
Accept: application/json
```

Activator MUST provide the list of kos on GET requests at {server path}/kos. This list MUST include metadata for each KO loaded from metadata.json files and it SHOULD include additional fields like status, original url and local url, if KOs are cached. It MAY include an error field, if there was an error in loading or installing the KO.

Request:

```json
GET /kos/{ko id} HTTP/1.1 
Accept: application/json
```

The activator MUST expose specific KOs based on their id on GET requests at {server path}/kos/{ko id}. Here is an example for a BMI calculator

Response:

```json
HTTP/1.1 200 OK
Content-type: application/json
{
    "@id": "bmi/calculator/v1.0",
    "@type": "koio:KnowledgeObject",
    "title": "BMI calculator",
    "identifier": "ark:/bmi/calculator/v1.0",
    "version": "v1.0",
    "description": "A knowledge object to calculate BMI and categories",
    "contributors": "Kgrid Team",
    "keywords": [
        "BMI",
        "calculator"
    ],
    "hasServiceSpecification": "service.yaml",
    "hasDeploymentSpecification": [
        {
            "@id": "bmi/calculator/v1.0/bmi",
            "post": {
                "engine": {
                    "name": "org.kgrid.python-activator",
                    "package": "bmi_calculator",
                    "module": "bmi",
                    "function": "calculate_bmi"
                }
            },
            "function": {
                "description": "<function calculate_bmi at 0x7f8777916de0>"
            }
        },
        {
            "@id": "bmi/calculator/v1.0/category",
            "post": {
                "engine": {
                    "name": "org.kgrid.python-activator",
                    "package": "bmi_calculator",
                    "module": "bmi",
                    "function": "get_bmi_category"
                }
            },
            "function": {
                "description": "<function get_bmi_category at 0x7f8777916b60>"
            }
        }
    ],
    "hasPayload": "src/bmi_calculator/bmi.py",
    "@context": [
        "http://kgrid.org/koio/contexts/knowledgeobject.jsonld"
    ],
    "status": "activated",
    "local_url": "bmi-calculator",
    "swaggerLink": "https://editor.swagger.io?url=http://127.0.0.1:8000/kos/bmi/calculator/v1.0/service.yaml"
}
```

##### Endpoints

Request:

```json
GET /endpoints HTTP/1.1 
Accept: application/json
```

Activator MUST provide a list of endpoints on GET requests at {server path}/endpoints. This list MUST include deployment data for each endpoint loaded from deployment.yaml files.

Request:

```json
GET /endpoints/{ko id}/{endpoint id} HTTP/1.1 
Accept: application/json
```

The activator MUST expose specific endpoint’s deployment information, based on their id on GET requests at {server path}/endpoints/{ko id}/{endpoint id}. Here is an example for the BMI calculator


Response:

```json
Response:
HTTP/1.1 200 OK
Content-type: application/json
{
    "@id": "bmi/calculator/v1.0/bmi",
    "post": {
        "engine": {
            "name": "org.kgrid.python-activator",
            "package": "bmi_calculator",
            "module": "bmi",
            "function": "calculate_bmi"
        }
    },
    "function": {
        "description": "<function calculate_bmi at 0x7f7039b75ee0>"
    }
}
```

### 5.4 KO request / response API <a name="postrequest"></a>

Request:

```json
POST /endpoints/{ko id}/{endpoint id} HTTP/1.1 
Accept: application/json
Content-type: application/json
```

On POST requests for an endpoint at {server path}/endpoints/{ko id}/{endpoint id}, the activator MUST execute the function corresponding to the endpoint. It MUST pass the body of the request to the function. Here is an example of the body of the request in json format for the BMI calculator:


```json
{
    "height":1.82,
    "weight":64,
    "unit_system":"metric"
}
```

The response MUST be wrapped in a JSON object. The actual endpoint result MAY be made available under the result key. Here is an example of the response for the bmi calculator:

```json
HTTP/1.1 200 OK
Content-type: application/json
{
    "result": {
       "bmi": 19.32133800265668,
    }
    "info": {
        "bmi/calculator/v1.0/bmi": {
            "@id": "bmi/calculator/v1.0/bmi",
            "post": {
                "engine": {
                    "name": "org.kgrid.python-activator",
                    "package": "bmi_calculator",
                    "module": "bmi",
                    "function": "calculate_bmi"
                }
            },
            "function": {
                "description": "<function calculate_bmi at 0x7f674cd5f920>"
            }
        },
        "inputs": {
            "height": 1.82,
            "weight": 64,
            "unit_system": "metric"
        }
    }
}
```

The activator SHOULD use domain specific custom exceptions for error handling of the requests-response process. Http response SHOULD include the name of the corresponding exception as title, the error message as detail and the error code. Examples of such domain specific exceptions include

- EndpointNotFoundError MAY be used for errors related to not being able to find an endpoint using the provided endpoint path with error code 404: 
    ```json
    HTTP/1.1 404 Not Found
    Content-type: application/json
    {
        "title": "EndpointNotFoundError",
        "detail": "KeyError('bmi/calculator/v1.0/bmi1')"
    }
    ```

- KONotFoundError MAY be used for errors related to not being able to find a KO using the provided ko path  with error code 404:

    ```json
    HTTP/1.1 404 Not Found
    Content-type: application/json
    {
        "title": "KONotFoundError",
        "detail": "KeyError('python/simple/v1.01')"
    }
    ```

- InvalidInputParameterError MAY be used to handle errors related to the input parameters provided in the body of the http request for executing the endpoint function  with error code 500:

    ```json
    HTTP/1.1 500 Internal Server Error
    Content-type: application/json
    {
        "title": "InvalidInputParameterError",
        "detail": "KeyError('height')"
    }
    ```

### 5.5 Logging

The activator MUST log normal events like loading and installing KOs and requests and responses for endpoints. 

The activator SHOULD use a short representation of KOs for logging including 
- @id
- Local URL
- status
- Error (if any)

## 6. Reference Implementations
The following two activators are implemented as reference implementations of this specification 


[Python Activator](https://github.com/kgrid/python-activator) and [JavaScrirpt Activator](https://github.com/kgrid/javascript-activator) are reference implementations of this Knowledge Grid Activator Specification and both adhere meticulously to this specification. They serves as reliable and compliant models for the activation of computable biomedical knowledge objects as per the specified guidelines.

In the course of implementing the Python and JavaScript activator, certain aspects of the application required nuanced considerations due to rules that were not explicitly defined or were presented with a degree of flexibility in the specifications. To see more detail on these customizations and adaptations please see Customizations and Adaptations section of the documentation in each activator.

In areas where the specifications did not explicitly define rules for certain aspects of the application, the Python and JavaScript activators were implemented with additional features, incorporating assumptions and following certain approaches, ensuring that they do not infringe upon or violate the specification. To see more detail about these features and assumptions please see Extended Features and Implementation Considerations section of the documentation in each activator.

## Appendix

### Notes

For environment variables to avoid conflicts with other activators and apps, the activator SHOULD use its id as part of the environment variable names. Example: ORG_KGRID_PYTHON_ACTIVATOR_MANIFEST_PATH

### Knowledge Object Implementation <a name="object"></a>

Knowledge object is a collection of metadata and binary files that together have a unique identifier (including a version identifier). There are some required and some optional file types in a knowledge object. These files, their content and the way they are structured inside a KO could vary deponding on which kgrid version is used to create the knowledge object. Please refere to [Kgrid Knowledge Objects](https://github.com/kgrid/koio/kgrid_knowledge_objects.md) on our koio ontology repository for documentation on different versions of krid knowledge object model.

## Related links
- [Kgrid Website](https://kgrid.org/)
- [Python Activator](https://github.com/kgrid/python-activator)
- [JavaScrirpt Activator](https://github.com/kgrid/javascript-activator)
- [kgrid Reference Objects](https://github.com/kgrid/reference-objects)
- [Kgrid Knowledge Objects](https://github.com/kgrid/koio/kgrid_knowledge_objects.md) 
- [Knowledge Object Implementation Ontology (KOIO)](https://github.com/kgrid/koio)

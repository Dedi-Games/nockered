import got, {
  Got,
  Request,
  HTTPAlias,
  Options,
  OptionsOfTextResponseBody,
  OptionsOfJSONResponseBody,
  StreamOptions
} from 'got'
import { DeepRequired } from '../utils/DeepRequired.js'

export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface ErrorResponse {
  success: false
  error: string
}

export abstract class BaseAPI {
  protected got: Got

  protected constructor(options: Pick<Options, 'prefixUrl'>) {
    // "(got as Got)" to have the right extend() function typing
    this.got = (got as Got).extend({ ...options, enableUnixSockets: true })
  }

  /**
   * Request a JSON endpoint
   * @param method HTTP method
   * @param endpoint Endpoint path
   * @param requestOptions Request options
   * @protected
   */
  protected async jsonEndpoint<
    R,
    O extends OptionsOfJSONResponseBody = OptionsOfJSONResponseBody
  >(
    method: HTTPAlias,
    endpoint: string,
    requestOptions?: O
  ): Promise<SuccessResponse<DeepRequired<R>> | ErrorResponse> {
    try {
      const response = (await this.got[method](
        endpoint,
        requestOptions
      ).json()) as DeepRequired<R>
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: (error as { message: string }).message
      }
    }
  }

  /**
   * Request a text endpoint
   * @param method HTTP method
   * @param endpoint Endpoint path
   * @param requestOptions Request options
   * @protected
   */
  protected async textEndpoint<
    O extends OptionsOfTextResponseBody = OptionsOfTextResponseBody
  >(
    method: HTTPAlias,
    endpoint: string,
    requestOptions?: O
  ): Promise<SuccessResponse<string> | ErrorResponse> {
    try {
      const response = await this.got[method](endpoint, requestOptions).text()
      return {
        success: true,
        data: response
      }
    } catch (error) {
      return {
        success: false,
        error: (error as { message: string }).message
      }
    }
  }

  /**
   * Request a stream endpoint
   * @param method HTTP method
   * @param endpoint Endpoint path
   * @param requestOptions Request options
   * @protected
   */
  protected streamEndpoint<O extends StreamOptions = StreamOptions>(
    method: HTTPAlias,
    endpoint: string,
    requestOptions?: O
  ): Request {
    return this.got.stream[method](endpoint, requestOptions)
  }
}

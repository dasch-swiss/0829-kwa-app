-- Copyright © 2015-2019 the contributors (see Contributors.md).
--
-- This file is part of Knora.
--
-- Knora is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published
-- by the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- Knora is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public
-- License along with Knora.  If not, see <http://www.gnu.org/licenses/>.

require "get_knora_session"

-------------------------------------------------------------------------------
-- This function is being called from sipi before the file is served
-- Knora is called to ask for the user's permissions on the file
-- Parameters:
--    prefix: This is the prefix that is given on the IIIF url
--    identifier: the identifier for the image
--    cookie: The cookie that may be present
--
-- Returns:
--    permission:
--       'allow' : the view is allowed with the given IIIF parameters
--       'restrict:watermark=<path-to-watermark>' : Add a watermark
--       'restrict:size=<iiif-size-string>' : reduce size/resolution
--       'deny' : no access!
--    filepath: server-path where the master file is located
-------------------------------------------------------------------------------
function pre_flight(prefix, identifier, cookie)

    if config.prefix_as_path then
        filepath = config.imgroot .. '/' .. prefix .. '/' .. identifier
    else
        filepath = config.imgroot .. '/' .. identifier
    end

    if prefix == "thumbs" then
        -- always allow thumbnails
        return 'allow', filepath
    end

    if prefix == "tmp" then
        -- always allow access to tmp folder
        return 'allow', filepath
    end

    knora_cookie_header = nil

    if cookie ~='' then

        -- tries to extract the Knora session id from the cookie:
        -- gets the digits between "sid=" and the closing ";" (only given in case of several key value pairs)
        -- returns nil if it cannot find it
        session_id = get_session_id(cookie)

        if session_id == nil then
            -- no session_id could be extracted
            print("cookie key is invalid: " .. cookie)
            server.log("cookie key is invalid: " .. cookie, server.loglevel.LOG_ERR)
        else
            knora_cookie_header = { Cookie = "KnoraAuthentication=" .. session_id }
        end
    end

    -- #snip_marker
    --
    -- Allows to set SIPI_WEBAPI_HOSTNAME environment variable and use its value.
    --
    local webapi_hostname = os.getenv("SIPI_WEBAPI_HOSTNAME")
    if webapi_hostname == nil then
        webapi_hostname = config.knora_path
    end
    server.log("webapi_hostname: " .. webapi_hostname, server.loglevel.LOG_DEBUG)

    --
    -- Allows to set SIPI_WEBAPI_PORT environment variable and use its value.
    --
    local webapi_port = os.getenv("SIPI_WEBAPI_PORT")
    if webapi_port == nil then
        webapi_port = config.knora_port
    end
    server.log("webapi_port: " .. webapi_port, server.loglevel.LOG_DEBUG)

    knora_url = 'http://' .. webapi_hostname .. ':' .. webapi_port .. '/admin/files/' .. prefix .. '/' ..  identifier
    -- #snip_marker

    -- print("knora_url: " .. knora_url)
    server.log("pre_flight - knora_url: " .. knora_url, server.loglevel.LOG_DEBUG)
    server.log("pre_flight - knora_cookie_header: " .. tostring(knora_cookie_header), server.loglevel.LOG_DEBUG)

    success, result = server.http("GET", knora_url, knora_cookie_header, 5000)

    -- check HTTP request was successful
    if not success then
        server.log("Server.http() failed: " .. result, server.loglevel.LOG_ERR)
        return 'deny'
    end

    if result.status_code ~= 200 then
        server.log("Knora returned HTTP status code " .. result.status_code, server.loglevel.LOG_ERR)
        server.log(result.body, server.loglevel.LOG_ERR)
        return 'deny'
    end

    server.log("pre_flight - response body: " .. tostring(result.body), server.loglevel.LOG_DEBUG)

    success, response_json = server.json_to_table(result.body)
    if not success then
        server.log("Server.http() failed: " .. response_json, server.loglevel.LOG_ERR)
        return 'deny'
    end

    server.log("pre_flight - status: " .. response_json.status, server.loglevel.LOG_DEBUG)
    server.log("pre_flight - permission code: " .. response_json.permissionCode, server.loglevel.LOG_DEBUG)

    if response_json.status ~= 0 then
        -- something went wrong with the request, Knora returned a non zero status
        return 'deny'
    end

    if response_json.permissionCode == 0 then
        -- no view permission on file
        return 'deny'
    elseif response_json.permissionCode == 1 then
        -- restricted view permission on file
        -- either watermark or size (depends on project, should be returned with permission code by Sipi responder)
        -- currently, only size is used

        server.log("pre_flight - restricted view settings - size: " .. tostring(response_json.restrictedViewSettings.size), server.loglevel.LOG_DEBUG)
        server.log("pre_flight - restricted view settings - watermark: " .. tostring(response_json.restrictedViewSettings.watermark), server.loglevel.LOG_DEBUG)

        local restrictedViewSize = response_json.restrictedViewSettings.size
        if restrictedViewSize == nil then
            restrictedViewSize = config.thumb_size
        end

        return {
            type = 'restrict',
            size = restrictedViewSize
        }, filepath
    elseif response_json.permissionCode >= 2 then
        -- full view permissions on file
        return 'allow', filepath
    else
        -- invalid permission code
        return 'deny'
    end
end
-------------------------------------------------------------------------------

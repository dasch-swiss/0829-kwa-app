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
function pre_flight(prefix,identifier,cookie)

    --
    -- Allways allows access to images. No authorization from Knora is retrieved
    -- allowing to also access images that are not inside Knora
    --

    filepath = config.imgroot .. '/knora/Leaves.jp2'
    
    server.log("Returning test file " .. filepath, server.loglevel.LOG_INFO)
    
    return 'allow', filepath

end
-------------------------------------------------------------------------------
